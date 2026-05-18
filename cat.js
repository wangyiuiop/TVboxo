const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');
const dns = require('dns');
const net = require('net');

const BASE_URL = 'https://www.4kvm.tv';
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15'
];

let currentProxy = null;
let dnsCache = new Map();
const DEFAULT_TIMEOUT = 60000;
const MAX_RETRIES = 5;

function getRandomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getHeaders(customHeaders = {}) {
    return {
        'User-Agent': getRandomUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': BASE_URL,
        'Origin': BASE_URL,
        'Connection': 'keep-alive',
        ...customHeaders
    };
}

function resolveDNS(hostname) {
    if (dnsCache.has(hostname)) {
        const cached = dnsCache.get(hostname);
        if (Date.now() - cached.timestamp < 300000) {
            return Promise.resolve(cached.addresses);
        }
    }
    return new Promise((resolve, reject) => {
        dns.resolve4(hostname, (err, addresses) => {
            if (err) return reject(err);
            dnsCache.set(hostname, { addresses, timestamp: Date.now() });
            resolve(addresses);
        });
    });
}

function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch (e) {
            return reject(new Error(`无效的URL: ${url}`));
        }

        const timeout = options.timeout || DEFAULT_TIMEOUT;
        const lib = urlObj.protocol === 'https:' ? https : http;
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: getHeaders(options.headers),
            timeout: timeout,
            servername: urlObj.hostname
        };

        if (options.data) {
            const dataStr = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
            reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            reqOptions.headers['Content-Length'] = Buffer.byteLength(dataStr);
            reqOptions.body = dataStr;
        }

        let proxyReq;
        if (currentProxy) {
            const proxyUrl = new URL(currentProxy);
            const proxyOptions = {
                host: proxyUrl.hostname,
                port: parseInt(proxyUrl.port) || (proxyUrl.protocol === 'https:' ? 443 : 80),
                method: 'CONNECT',
                path: `${urlObj.hostname}:${urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80)}`
            };

            if (proxyUrl.username && proxyUrl.password) {
                const auth = Buffer.from(`${proxyUrl.username}:${proxyUrl.password}`).toString('base64');
                proxyOptions.headers = { 'Proxy-Authorization': `Basic ${auth}` };
            }

            const proxyConn = net.connect(proxyOptions, () => {
                const tlsSocket = require('tls').connect({
                    host: urlObj.hostname,
                    socket: proxyConn,
                    servername: urlObj.hostname
                }, () => {
                    const httpReq = http.request({
                        ...reqOptions,
                        createConnection: () => tlsSocket,
                        agent: false
                    }, handleResponse);
                    setupRequest(httpReq, options.data);
                    proxyReq = httpReq;
                });
                tlsSocket.on('error', (e) => {
                    if (!proxyReq || !proxyReq.destroyed) reject(e);
                });
            });

            proxyConn.on('error', reject);
            proxyConn.on('timeout', () => { proxyConn.destroy(); reject(new Error('代理连接超时')); });
            proxyConn.setTimeout(timeout);
        } else {
            const req = lib.request(reqOptions, handleResponse);
            setupRequest(req, options.data);
            proxyReq = req;
        }

        function setupRequest(req, data) {
            req.on('error', (e) => {
                console.error(`[DEBUG] 请求错误: ${e.message}`);
                reject(e);
            });
            req.on('timeout', () => {
                console.error(`[DEBUG] 请求超时 (${timeout}ms): ${url}`);
                req.destroy();
                reject(new Error(`请求超时 (${timeout}ms)`));
            });
            req.on('abort', () => {
                reject(new Error('请求被中断'));
            });

            if (data) {
                const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
                req.write(dataStr);
            }
            req.end();
        }

        function handleResponse(res) {
            const chunks = [];
            let totalSize = 0;

            res.on('data', (chunk) => {
                chunks.push(chunk);
                totalSize += chunk.length;
            });

            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                let body = buffer;

                const encoding = res.headers['content-encoding'];
                if (encoding === 'gzip') {
                    try { body = require('zlib').gunzipSync(buffer); } catch (e) {}
                } else if (encoding === 'deflate') {
                    try { body = require('zlib').inflateSync(buffer); } catch (e) {}
                } else if (encoding === 'br') {
                    try { body = require('zlib').brotliDecompressSync(buffer); } catch (e) {}
                }

                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body.toString('utf-8'),
                    raw: body,
                    size: totalSize
                });
            });

            res.on('error', (e) => {
                reject(e);
            });
        }
    });
}

async function fetchWithRetry(url, maxRetries = MAX_RETRIES) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            if (i > 0) {
                const delay = Math.min(1000 * Math.pow(2, i), 10000);
                console.log(`[RETRY] 第${i + 1}/${maxRetries}次重试... (等待${delay}ms)`);
                await new Promise(r => setTimeout(r, delay));
            }

            const result = await request(url, { timeout: DEFAULT_TIMEOUT + (i * 10000) });
            return result;
        } catch (e) {
            lastError = e;
            console.error(`[ERROR] 请求失败 (${i + 1}/${maxRetries}): ${e.message}`);

            if (e.message.includes('ECONNREFUSED')) {
                throw new Error('连接被拒绝，请检查网络或使用代理 --proxy http://host:port');
            }
            if (e.message.includes('ENOTFOUND')) {
                throw new Error('DNS解析失败，请检查网络连接或使用代理');
            }
        }
    }

    throw lastError || new Error('请求失败');
}

function extractPlayerConfig(html) {
    const patterns = [
        { regex: /var\s+player_config\s*=\s*({[^;]+})/i, type: 'config' },
        { regex: /var\s+player[\w]*\s*=\s*(\{[^;]+\})/gi, type: 'config' },
        { regex: /["']?url["']?\s*[:=]\s*["']([^"']+\.m3u8[^"']*)["']/gi, type: 'm3u8_url' },
        { regex: /["']?src["']?\s*[:=]\s*["']([^"']+(?:m3u8|mp4|flv)[^"']*)["']/gi, type: 'video_src' },
        { regex: /source\s*:\s*\{[^}]*file\s*:\s*["']([^"']+)["']/gi, type: 'source_file' },
        { regex: /data-(?:config|url|src|video)\s*=\s*["']([^"']+)["']/gi, type: 'data_attr' },
        { regex: /window\.__(?:INITIAL_STATE|PLAYER|VIDEO)__\s*=\s*({.+?})\s*<\/script>/i, type: 'state' },
        { regex: /play(?:Url|Source|Address)["'\s:]+["']([^"']+)["']/gi, type: 'play_url' },
        { regex: /video(?:Url|Src|Source|Path)["'\s:]+["']([^"']+\.m3u8[^"']*)["']/gi, type: 'video_m3u8' },
        { regex: /["'](https?:\/\/[^"']+(?:m3u8|\.ts|video|stream)[^"']*)["']/gi, type: 'stream_url' },
        { regex: /api["'\s:]+["']([^"']*api[^"']+)["']/gi, type: 'api_url' },
        { regex: /embed(?:Code|Id|Url)["'\s:]+["']([^"']+)["']/gi, type: 'embed_code' },
        { regex: /(https?:\/\/[^\s"'<>]+\.(?:m3u8|mp4|flv)[^\s"'<>]*)/gi, type: 'direct_url' }
    ];

    let results = [];
    for (const { regex, type } of patterns) {
        let match;
        const re = new RegExp(regex.source, regex.flags);
        while ((match = re.exec(html)) !== null) {
            results.push({
                type: type,
                match: match[1] || match[0],
                index: match.index,
                context: html.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
            });
        }
    }

    return results;
}

function extractScriptBlocks(html) {
    const scripts = [];
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
        const attrs = match[1];
        const content = match[2].trim();

        if (!content || content.length < 10) continue;

        const hasRelevantContent =
            content.includes('player') ||
            content.includes('video') ||
            content.includes('m3u8') ||
            content.includes('play') ||
            content.includes('encrypt') ||
            content.includes('decode') ||
            content.includes('base64') ||
            content.includes('aes') ||
            content.includes('token') ||
            content.includes('sign') ||
            content.includes('key') ||
            content.includes('url') ||
            content.includes('src') ||
            content.includes('config') ||
            attrs.includes('src');

        if (hasRelevantContent) {
            scripts.push({
                src: attrs.match(/src=["']([^"']+)["']/i)?.[1] || null,
                content: content.substring(0, 5000),
                fullLength: content.length,
                index: match.index
            });
        }
    }

    return scripts;
}

function decodeEncodedString(str) {
    if (!str) return str;

    str = str.trim();

    try {
        if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(str)) {
            const decoded = Buffer.from(str, 'base64').toString('utf-8');
            if (/^[\x20-\x7E\u4e00-\u9fa5]+$/.test(decoded) && decoded.length > 5) {
                return decoded;
            }
        }
    } catch (e) {}

    try {
        if (str.startsWith('%') || /%[0-9A-Fa-f]{2}/.test(str)) {
            return decodeURIComponent(str);
        }
    } catch (e) {}

    try {
        if (str.startsWith('\\u') || /\\u[0-9A-Fa-f]{4}/.test(str)) {
            return JSON.parse(`"${str}"`);
        }
    } catch (e) {}

    const hexMatch = str.match(/^(?:0x)?([0-9a-fA-F]+)$/);
    if (hexMatch && hexMatch[1].length >= 10 && hexMatch[1].length % 2 === 0) {
        try {
            return Buffer.from(hexMatch[1], 'hex').toString('utf-8');
        } catch (e) {}
    }

    return str;
}

function parseM3U8(content, baseUrl) {
    const lines = content.split('\n');
    const result = {
        isMaster: false,
        variants: [],
        segments: [],
        key: null,
        duration: 0,
        targetDuration: 0,
        version: -1,
        mediaSequence: 0
    };

    let currentVariant = null;
    let currentKey = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXTM3U')) continue;

        if (line.startsWith('#EXT-X-VERSION')) {
            result.version = parseInt(line.split(':')[1]) || -1;
        } else if (line.startsWith('#EXT-X-STREAM-INF')) {
            result.isMaster = true;
            currentVariant = {};
            const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
            const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
            const codecsMatch = line.match(/CODECS="([^"]*)"/);
            const frameRateMatch = line.match(/FRAME-RATE=([\d.]+)/);

            if (bandwidthMatch) currentVariant.bandwidth = parseInt(bandwidthMatch[1]);
            if (resolutionMatch) currentVariant.resolution = resolutionMatch[1];
            if (codecsMatch) currentVariant.codecs = codecsMatch[1];
            if (frameRateMatch) currentVariant.frameRate = parseFloat(frameRateMatch[1]);
        } else if (line && !line.startsWith('#') && currentVariant) {
            currentVariant.url = resolveUrl(line, baseUrl);
            result.variants.push(currentVariant);
            currentVariant = null;
        } else if (line.startsWith('#EXT-X-TARGETDURATION')) {
            result.targetDuration = parseInt(line.split(':')[1]) || 0;
        } else if (line.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
            result.mediaSequence = parseInt(line.split(':')[1]) || 0;
        } else if (line.startsWith('#EXT-X-KEY')) {
            const methodMatch = line.match(/METHOD=([^,]+)/);
            const uriMatch = line.match(/URI="([^"]*)"/);
            const ivMatch = line.match(/IV=0x([0-9a-fA-F]+)/);
            const keyFormatMatch = line.match(/KEYFORMAT="([^"]*)"/);

            if (methodMatch && uriMatch) {
                currentKey = {
                    method: methodMatch[1],
                    url: resolveUrl(uriMatch[1], baseUrl),
                    iv: ivMatch ? Buffer.from(ivMatch[1], 'hex') : null,
                    format: keyFormatMatch ? keyFormatMatch[1] : null
                };
                result.key = currentKey;
            }
        } else if (line === '#EXT-X-DISCONTINUITY') {
            currentKey = null;
        } else if (line.startsWith('#EXTINF')) {
            const parts = line.split(':');
            const durationPart = parts[1]?.split(',')[0] || '0';
            const duration = parseFloat(durationPart) || 0;
            result.duration += duration;

            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (nextLine && !nextLine.startsWith('#')) {
                    result.segments.push({
                        url: resolveUrl(nextLine, baseUrl),
                        duration: duration,
                        encrypted: currentKey !== null,
                        keyInfo: currentKey ? { ...currentKey } : null,
                        sequence: result.mediaSequence + result.segments.length
                    });
                }
            }
        } else if (line.startsWith('#EXT-X-BYTERANGE')) {
            if (result.segments.length > 0) {
                const byteRange = line.split(':')[1];
                result.segments[result.segments.length - 1].byteRange = byteRange;
            }
        } else if (line.startsWith('#EXT-X-MAP')) {
            const uriMatch = line.match(/URI="([^"]*)"/);
            if (uriMatch) {
                result.initSegment = resolveUrl(uriMatch[1], baseUrl);
            }
        }
    }

    return result;
}

function resolveUrl(url, base) {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    try {
        return new URL(url, base).href;
    } catch (e) {
        return url;
    }
}

function decryptAES128(buffer, key, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv || Buffer.alloc(16, 0));
        decipher.setAutoPadding(true);
        const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return decrypted;
    } catch (e) {
        console.error(`[ERROR] 解密失败: ${e.message}`);
        return buffer;
    }
}

async function downloadFile(url, destPath, onProgress) {
    return new Promise(async (resolve, reject) => {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const response = await fetchWithRetry(url);

        if (response.status >= 300 && response.status < 400 && response.headers.location) {
            return downloadFile(response.headers.location, destPath, onProgress)
                .then(resolve).catch(reject);
        }

        if (response.status !== 200) {
            reject(new Error(`HTTP ${response.status}`));
            return;
        }

        fs.writeFileSync(destPath, response.raw);

        if (onProgress) onProgress(response.size, response.size);

        resolve(destPath);
    });
}

class Crawler4KVM {
    constructor(options = {}) {
        this.cache = new Map();
        this.sessionCookies = '';
        this.options = {
            timeout: options.timeout || DEFAULT_TIMEOUT,
            proxy: options.proxy || null,
            debug: options.debug || false
        };

        if (options.proxy) {
            currentProxy = options.proxy;
            console.log(`[CONFIG] 使用代理: ${currentProxy}`);
        }
    }

    async testConnection() {
        console.log('[TEST] 测试网络连接...');
        try {
            const start = Date.now();
            await request(BASE_URL, { timeout: 15000 });
            const elapsed = Date.now() - start;
            console.log(`[TEST] 连接成功! 耗时: ${elapsed}ms`);
            return true;
        } catch (e) {
            console.error(`[TEST] 连接失败: ${e.message}`);
            console.error('[TIP] 如果网络不通，可以尝试:');
            console.error('  1. 使用代理: node cat.js <id> --proxy http://127.0.0.1:7890');
            console.error('  2. 检查防火墙设置');
            console.error('  3. 使用VPN');
            return false;
        }
    }

    async getPlayPage(playId) {
        const url = `${BASE_URL}/play/${playId}`;
        console.log(`[INFO] 获取播放页面: ${url}`);

        const response = await fetchWithRetry(url);

        if (response.status !== 200) {
            throw new Error(`获取页面失败: HTTP ${response.status}`);
        }

        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            this.sessionCookies = Array.isArray(setCookie)
                ? setCookie.map(c => c.split(';')[0]).join('; ')
                : setCookie.split(';')[0];
        }

        console.log(`[INFO] 页面大小: ${(response.size / 1024).toFixed(1)}KB`);

        return response.body;
    }

    async analyzePlayPage(playId) {
        const html = await this.getPlayPage(playId);
        console.log('\n[INFO] 开始分析页面结构...\n');

        const configMatches = extractPlayerConfig(html);
        console.log(`[INFO] 找到 ${configMatches.length} 个可能的配置项:\n`);

        configMatches.forEach((match, idx) => {
            console.log(`--- 配置 #${idx + 1} [${match.type}] ---`);
            console.log(`位置: 字符 ${match.index}`);
            console.log(`内容: ${match.match.substring(0, 300)}`);
            if (this.options.debug) {
                console.log(`上下文: ...${match.context}...`);
            }
            console.log('');
        });

        const scripts = extractScriptBlocks(html);
        console.log(`[INFO] 找到 ${scripts.length} 个相关脚本块:\n`);

        scripts.forEach((script, idx) => {
            console.log(`--- 脚本 #${idx + 1} ---`);
            if (script.src) console.log(`外部JS: ${script.src}`);
            console.log(`长度: ${script.fullLength} 字符`);
            console.log(`预览:`);
            console.log(script.content.substring(0, 600));
            console.log('...\n');
        });

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : playId;

        const ogTitle = html.match(/property="og:title"\s+content="([^"]+)"/i);
        const description = html.match(/property="og:description"\s+content="([^"]+)"/i);
        const image = html.match(/property="og:image"\s+content="([^"]+)"/i);

        return {
            html,
            configs: configMatches,
            scripts,
            title: ogTitle?.[1] || title,
            description: description?.[1],
            image: image?.[1],
            playId,
            size: html.length
        };
    }

    extractVideoUrls(analysisResult) {
        const urls = new Map();
        const { html, configs, scripts } = analysisResult;

        configs.forEach(config => {
            const decoded = decodeEncodedString(config.match);
            if (decoded && decoded !== config.match) {
                urls.set(decoded, { source: `config[${config.type}]`, original: config.match });
            }
            if (config.type.includes('url') || config.type.includes('m3u8') || config.type.includes('stream')) {
                urls.set(config.match, { source: `config[${config.type}]` });
            }
        });

        const allPatterns = [
            /["'](https?:\/\/[^"']*\.m3u8[^"']*)["']/g,
            /["'](https?:\/\/[^"']*(?:mp4|flv|mkv|ts)[^"']*)["']/g,
            /url\s*[=:]\s*["']([^"']+)["']/g,
            /src\s*[=:]\s*["']([^"']+)["']/g,
            /file\s*[=:]\s*["']([^"']+)["']/g,
            /playUrl\s*[=:]\s*["']([^"']+)["']/g,
            /videoUrl\s*[=:]\s*["']([^"']+)["']/g,
            /["']([^"']*4kvm[^"']*(?:m3u8|api|play|video|stream)[^"']*)["']/gi,
            /["']([^"']*cdn[^"']*(?:m3u8|video|stream)[^"']*)["']/gi,
            /["']([^"']*(?:cloudflare|vod|media|cache)[^"']*\.(?:m3u8|mp4)[^"']*)["']/gi
        ];

        for (const pattern of allPatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                const url = match[1];
                const decoded = decodeEncodedString(url);
                urls.set(decoded || url, { source: 'html_regex' });
            }
        }

        scripts.forEach(script => {
            for (const pattern of allPatterns) {
                let match;
                const re = new RegExp(pattern.source, pattern.flags);
                while ((match = re.exec(script.content)) !== null) {
                    const url = match[1];
                    const decoded = decodeEncodedString(url);
                    urls.set(decoded || url, { source: `script[${script.src || 'inline'}]` });
                }
            }

            const jsonPatterns = [
                /\{[^{}]*"(?:url|src|file|playUrl)"\s*:\s*"([^"]+)"/g,
                /["']?(?:url|src|file|playUrl|videoUrl)["']?\s*[:=]\s*["']([^"']+)/g
            ];

            for (const pattern of jsonPatterns) {
                let match;
                const re = new RegExp(pattern.source, pattern.flags);
                while ((match = re.exec(script.content)) !== null) {
                    const url = match[1];
                    if (url.includes('http') || url.includes('.m3u8') || url.includes('.mp4')) {
                        urls.set(url, { source: `script_json[${script.src || 'inline'}]` });
                    }
                }
            }
        });

        return Array.from(urls.entries()).map(([url, info]) => ({ url, ...info }));
    }

    async resolveM3U8(m3u8Url) {
        console.log(`\n[INFO] 解析 M3U8 地址: ${m3u8Url}`);

        const response = await fetchWithRetry(m3u8Url);
        const m3u8Content = response.body;
        const parsed = parseM3U8(m3u8Content, m3u8Url);

        if (parsed.isMaster) {
            console.log(`[INFO] ✓ 检测到 Master Playlist (多画质)`);
            console.log(`[INFO] 可用画质选项 (${parsed.variants.length}个):\n`);

            parsed.variants.forEach((v, idx) => {
                const bw = v.bandwidth ? `${(v.bandwidth / 1000000).toFixed(2)}Mbps` : '未知';
                const res = v.resolution || '未知';
                const fps = v.frameRate ? `${v.frameRate}fps` : '';
                console.log(`  ${idx + 1}. ${res} ${fps.padStart(6)} [${bw}]`);
                console.log(`     URL: ${v.url}\n`);
            });

            return parsed;
        }

        console.log(`[INFO] ✓ Media Playlist (视频流)`);
        console.log(`[INFO] 分片数量: ${parsed.segments.length}`);
        console.log(`[INFO] 总时长: ${Math.round(parsed.duration)}秒 (~${Math.round(parsed.duration / 60)}分钟)`);
        console.log(`[INFO] 目标分片时长: ${parsed.targetDuration}秒`);

        if (parsed.key) {
            console.log(`\n[WARN] ⚠ 视频已加密!`);
            console.log(`[INFO] 加密方式: ${parsed.key.method}`);
            console.log(`[INFO] 密钥地址: ${parsed.key.url}`);
            if (parsed.key.iv) {
                console.log(`[INFO] IV向量: ${parsed.key.iv.toString('hex')}`);
            }
        } else {
            console.log(`[INFO] ✓ 视频未加密`);
        }

        if (parsed.initSegment) {
            console.log(`[INFO] 初始化分段: ${parsed.initSegment}`);
        }

        return parsed;
    }

    async downloadVideo(m3u8Url, outputDir = './downloads', quality = 'best') {
        const m3u8Data = await this.resolveM3U8(m3u8Url);

        let targetPlaylist = m3u8Data;
        if (m3u8Data.isMaster && m3u8Data.variants.length > 0) {
            let selectedVariant;

            if (quality === 'best') {
                selectedVariant = m3u8Data.variants.reduce((prev, curr) =>
                    (prev.bandwidth || 0) > (curr.bandwidth || 0) ? prev : curr
                );
            } else if (quality === 'worst') {
                selectedVariant = m3u8Data.variants.reduce((prev, curr) =>
                    (prev.bandwidth || Infinity) < (curr.bandwidth || Infinity) ? prev : curr
                );
            } else {
                const idx = parseInt(quality) - 1;
                selectedVariant = m3u8Data.variants[idx >= 0 ? idx : 0];
            }

            console.log(`\n[INFO] 选择画质: ${selectedVariant.resolution || '默认'} (${(selectedVariant.bandwidth / 1000000).toFixed(2)}Mbps)`);
            targetPlaylist = await this.resolveM3U8(selectedVariant.url);
        }

        if (!targetPlaylist.segments.length) {
            throw new Error('未找到视频分片数据');
        }

        const outputDirPath = path.resolve(outputDir);
        if (!fs.existsSync(outputDirPath)) fs.mkdirSync(outputDirPath, { recursive: true });

        let keyBuffer = null;
        if (targetPlaylist.key) {
            console.log('\n[INFO] 下载解密密钥...');
            try {
                const keyResponse = await fetchWithRetry(targetPlaylist.key.url);
                keyBuffer = keyResponse.raw;
                console.log(`[INFO] ✓ 密钥获取成功 (${keyBuffer.length} bytes)`);
            } catch (e) {
                console.error(`[ERROR] 密钥下载失败: ${e.message}`);
                throw new Error('无法获取解密密钥');
            }
        }

        const tsFiles = [];
        const totalSegments = targetPlaylist.segments.length;
        let completedSegments = 0;
        let failedSegments = 0;
        const startTime = Date.now();

        console.log(`\n${'═'.repeat(55)}`);
        console.log(`  开始下载 ${totalSegments} 个视频分片`);
        console.log(`${'═'.repeat(55)}\n`);

        for (let i = 0; i < targetPlaylist.segments.length; i++) {
            const segment = targetPlaylist.segments[i];
            const tsPath = path.join(outputDirPath, `seg_${String(i).padStart(5, '0')}.ts`);

            try {
                if (fs.existsSync(tsPath) && fs.statSync(tsPath).size > 0) {
                    completedSegments++;
                    tsFiles.push(tsPath);
                    continue;
                }

                const tsData = await fetchWithRetry(segment.url);

                let dataToSave = tsData.raw;
                if (segment.encrypted && keyBuffer) {
                    const segmentIv = segment.keyInfo?.iv || targetPlaylist.key.iv ||
                        Buffer.alloc(16, 0);
                    dataToSave = decryptAES128(tsData.raw, keyBuffer, segmentIv);
                }

                fs.writeFileSync(tsPath, dataToSave);
                tsFiles.push(tsPath);
                completedSegments++;

                const progress = Math.round((completedSegments / totalSegments) * 100);
                const elapsed = (Date.now() - startTime) / 1000;
                const speed = completedSegments / elapsed;
                const eta = speed > 0 ? Math.round((totalSegments - completedSegments) / speed) : 0;

                process.stdout.write(
                    `\r  进度: [${'█'.repeat(Math.round(progress / 2))}${'░'.repeat(50 - Math.round(progress / 2))}] ` +
                    `${completedSegments}/${totalSegments} (${progress}%) | ` +
                    `速度: ${speed.toFixed(1)} seg/s | ` +
                    `剩余: ~${eta}s   `
                );
            } catch (e) {
                failedSegments++;
                console.error(`\n  [✗] 分片 ${i + 1} 失败: ${e.message}`);

                if (failedSegments > totalSegments * 0.3) {
                    throw new Error(`过多分片下载失败 (${failedSegments}/${totalSegments})`);
                }
            }

            if (i > 0 && i % 50 === 0) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n\n${'═'.repeat(55)}`);
        console.log(`  ✓ 下载完成!`);
        console.log(`  成功: ${completedSegments}/${totalSegments} 分片`);
        if (failedSegments > 0) console.log(`  失败: ${failedSegments} 分片`);
        console.log(`  耗时: ${totalTime}秒`);
        console.log(`  保存至: ${outputDirPath}`);
        console.log(`${'═'.repeat(55)}`);

        return {
            segments: tsFiles,
            outputDir: outputDirPath,
            stats: {
                total: totalSegments,
                success: completedSegments,
                failed: failedSegments,
                time: parseFloat(totalTime)
            },
            encrypted: keyBuffer !== null
        };
    }

    async crawl(playId, options = {}) {
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║              4KVM.TV 视频爬虫 v2.0                      ║');
        console.log('╠══════════════════════════════════════════════════════════╣');
        console.log(`║  目标: ${playId.padEnd(50)}║`);
        console.log(`║  时间: ${new Date().toLocaleString('zh-CN').padEnd(50)}║`);
        console.log('╚══════════════════════════════════════════════════════════╝\n');

        const connected = await this.testConnection();
        if (!connected && !currentProxy) {
            console.warn('\n[WARN] 无法直接连接，建议使用代理');
        }

        const analysis = await this.analyzePlayPage(playId);
        const videoUrls = this.extractVideoUrls(analysis);

        console.log(`${'═'.repeat(60)}`);
        console.log(`[结果] 标题: ${analysis.title}`);
        console.log(`[结果] 页面大小: ${(analysis.size / 1024).toFixed(1)}KB`);
        console.log(`[结果] 发现 ${videoUrls.length} 个视频地址:\n`);

        videoUrls.forEach((item, idx) => {
            console.log(`  ${idx + 1}. [${item.source}]`);
            console.log(`     ${item.url.substring(0, 120)}${item.url.length > 120 ? '...' : ''}`);
            if (item.original && item.original !== item.url) {
                console.log(`     原始: ${item.original.substring(0, 100)}`);
            }
            console.log('');
        });

        if (options.download && videoUrls.length > 0) {
            const m3u8Url = videoUrls.find(u => u.url.includes('.m3u8'))?.url || videoUrls[0].url;
            if (m3u8Url) {
                const result = await this.downloadVideo(
                    m3u8Url,
                    options.outputDir || './downloads',
                    options.quality || 'best'
                );

                const manifestPath = path.join(result.outputDir, 'manifest.json');
                fs.writeFileSync(manifestPath, JSON.stringify({
                    title: analysis.title,
                    playId: playId,
                    downloadTime: new Date().toISOString(),
                    segments: result.segments.length,
                    encrypted: result.encrypted,
                    stats: result.stats
                }, null, 2));

                console.log(`\n[完成] 清单文件: ${manifestPath}`);
                return { ...analysis, videoUrls, downloadResult: result };
            }
        }

        return { ...analysis, videoUrls };
    }
}

async function main() {
    const args = process.argv.slice(2);
    const playId = args.find(a => !a.startsWith('--'));
    const commandIdx = args.findIndex(a => ['analyze', 'download', 'test'].includes(a));
    const command = commandIdx !== -1 ? args[commandIdx] : null;

    const proxyIdx = args.indexOf('--proxy');
    if (proxyIdx !== -1) {
        currentProxy = args[proxyIdx + 1];
    }

    const outputIdx = args.indexOf('--output');
    const outputDir = outputIdx !== -1 ? args[outputIdx + 1] : './downloads';

    const qualityIdx = args.indexOf('--quality');
    const quality = qualityIdx !== -1 ? args[qualityIdx + 1] : 'best';

    const debugMode = args.includes('--debug');
    if (debugMode) process.env.DEBUG = 'true';

    if (!playId || playId === '-h' || playId === '--help') {
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║          4KVM.TV 视频爬虫 - Cat.js v2.0                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  用法:                                                        ║
║    node cat.js <playId> [命令] [选项]                         ║
║                                                              ║
║  命令:                                                        ║
║    (无)       分析页面并提取视频地址                          ║
║    analyze   仅分析页面结构                                   ║
║    download  分析并下载视频                                   ║
║    test      测试网络连接                                     ║
║                                                              ║
║  选项:                                                        ║
║    --proxy <URL>     使用代理 (例: http://127.0.0.1:7890)    ║
║    --output <目录>   输出目录 (默认: ./downloads)             ║
║    --quality <q>     画质选择: best/worst/序号                 ║
║    --debug           显示调试信息                             ║
║                                                              ║
║  示例:                                                        ║
║    node cat.js ch43p9mom                                    ║
║    node cat.js ch43p9mom download                           ║
║    node cat.js ch43p9mom download --proxy http://127.0.0.1:7890 ║
║    node cat.js ch43p9mom download --output ./videos --quality 1 ║
║                                                              ║
║  Play ID 示例:                                                ║
║    ch43p9mom  - 黑袍纠察队 第五季 第1集                       ║
║    ch44vpwk4 - 飞驰人生3                                      ║
║    ch459gcgp - 低智商犯罪                                     ║
║    cgzs2ud5p - 黑袍纠察队 第1季                               ║
╚══════════════════════════════════════════════════════════════╝
        `);
        return;
    }

    const crawler = new Crawler4KVM({
        proxy: currentProxy,
        debug: debugMode
    });

    try {
        if (command === 'test') {
            await crawler.testConnection();
            return;
        }

        const result = await crawler.crawl(playId, {
            download: command === 'download',
            outputDir: outputDir,
            quality: quality
        });

        if (command !== 'download') {
            console.log(`
  ┌─────────────────────────────────────────┐
  │  下一步操作:                            │
  │                                         │
  │  node cat.js ${playId} download         │
  │  node cat.js ${playId} download --proxy http://127.0.0.1:7890 │
  └─────────────────────────────────────────┘
            `);
        }
    } catch (e) {
        console.error(`\n✗ [FATAL ERROR] ${e.message}`);
        if (debugMode) console.error(e.stack);

        if (e.message.includes('timeout') || e.message.includes('ECONNREFUSED') || e.message.includes('ENOTFOUND')) {
            console.error(`
  故障排除:
  1. 使用代理: node cat.js ${playId} --proxy http://127.0.0.1:7890
  2. 检查网络连接
  3. 尝试使用 VPN
            `);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    Crawler4KVM,
    parseM3U8,
    decryptAES128,
    request,
    fetchWithRetry,
    extractPlayerConfig,
    extractScriptBlocks,
    decodeEncodedString
};
