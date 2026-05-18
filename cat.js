const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');

const BASE_URL = 'https://www.4kvm.tv';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const HEADERS = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webimage/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': BASE_URL,
    'Connection': 'keep-alive'
};

function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const lib = urlObj.protocol === 'https:' ? https : http;
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: { ...HEADERS, ...options.headers },
            timeout: options.timeout || 30000
        };

        if (options.data) {
            const dataStr = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
            reqOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            reqOptions.headers['Content-Length'] = Buffer.byteLength(dataStr);
        }

        const req = lib.request(reqOptions, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: buffer.toString('utf-8'),
                    raw: buffer
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });

        if (options.data) {
            const dataStr = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
            req.write(dataStr);
        }
        req.end();
    });
}

function extractPlayerConfig(html) {
    const patterns = [
        /var\s+player_config\s*=\s*({[^}]+})/i,
        /player.*?config\s*[:=]\s*({[^}]+(?:\{[^}]*\}[^}]*)*)/gi,
        /["']?url["']?\s*[:=]\s*["']([^"']+\.m3u8[^"']*)["']/gi,
        /["']?src["']?\s*[:=]\s*["']([^"']+(?:m3u8|mp4|flv)[^"']*)["']/gi,
        /source\s*:\s*\{[^}]*file\s*:\s*["']([^"']+)["']/gi,
        /data-config\s*=\s*["']({[^}]+})["']/i,
        /window\.__INITIAL_STATE__\s*=\s*({.+?})\s*<\/script>/i,
        /playUrl["'\s:]+["']([^"']+)["']/i,
        /url["'\s:]+["']([^"']*\.m3u8[^"']*)["']/i
    ];

    let results = [];
    for (const pattern of patterns) {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(html)) !== null) {
            results.push({
                type: pattern.toString().includes('config') ? 'config' : 'url',
                match: match[1] || match[0],
                index: match.index
            });
        }
    }

    return results;
}

function extractScriptBlocks(html) {
    const scripts = [];
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        const content = match[1].trim();
        if (content && (content.includes('player') || content.includes('video') ||
            content.includes('m3u8') || content.includes('play') ||
            content.includes('encrypt') || content.includes('decode') ||
            content.includes('base64') || content.includes('aes'))) {
            scripts.push({
                content: content,
                index: match.index
            });
        }
    }
    return scripts;
}

function decodeBase64Url(encoded) {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        return decoded;
    } catch (e) {
        return encoded;
    }
}

function decodeCustomEncode(str) {
    try {
        if (/^[a-zA-Z0-9+/=]+$/.test(str) && str.length > 20) {
            return Buffer.from(str, 'base64').toString('utf-8');
        }
        if (str.startsWith('%')) {
            return decodeURIComponent(str);
        }
        return str;
    } catch (e) {
        return str;
    }
}

function parseM3U8(content, baseUrl) {
    const lines = content.split('\n');
    const result = {
        isMaster: false,
        variants: [],
        segments: [],
        key: null,
        duration: 0,
        targetDuration: 0
    };

    let currentVariant = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXT-X-STREAM-INF')) {
            result.isMaster = true;
            currentVariant = {};
            const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
            const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
            const codecsMatch = line.match(/CODECS="([^"]+)"/);

            if (bandwidthMatch) currentVariant.bandwidth = parseInt(bandwidthMatch[1]);
            if (resolutionMatch) currentVariant.resolution = resolutionMatch[1];
            if (codecsMatch) currentVariant.codecs = codecsMatch[1];
        } else if (line && !line.startsWith('#') && currentVariant) {
            currentVariant.url = resolveUrl(line, baseUrl);
            result.variants.push(currentVariant);
            currentVariant = null;
        } else if (line.startsWith('#EXT-X-TARGETDURATION')) {
            result.targetDuration = parseInt(line.split(':')[1]) || 0;
        } else if (line.startsWith('#EXT-X-KEY')) {
            const methodMatch = line.match(/METHOD=([^,]+)/);
            const uriMatch = line.match(/URI="([^"]+)"/);
            const ivMatch = line.match(/IV=0x([0-9a-fA-F]+)/);

            if (methodMatch && uriMatch) {
                result.key = {
                    method: methodMatch[1],
                    url: resolveUrl(uriMatch[1], baseUrl),
                    iv: ivMatch ? Buffer.from(ivMatch[1], 'hex') : null
                };
            }
        } else if (line.startsWith('#EXTINF')) {
            const duration = parseFloat(line.split(':')[1].split(',')[0]) || 0;
            result.duration += duration;

            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (nextLine && !nextLine.startsWith('#')) {
                    result.segments.push({
                        url: resolveUrl(nextLine, baseUrl),
                        duration: duration,
                        encrypted: result.key !== null
                    });
                }
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

async function downloadFile(url, destPath, onProgress) {
    return new Promise(async (resolve, reject) => {
        const urlObj = new URL(url);
        const lib = urlObj.protocol === 'https:' ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: { ...HEADERS, 'Referer': BASE_URL }
        };

        const req = lib.request(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                downloadFile(res.headers.location, destPath, onProgress)
                    .then(resolve).catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }

            const totalSize = parseInt(res.headers['content-length']) || 0;
            let downloadedSize = 0;

            const dir = path.dirname(destPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const fileStream = fs.createWriteStream(destPath);
            res.pipe(fileStream);

            res.on('data', (chunk) => {
                downloadedSize += chunk.length;
                if (onProgress && totalSize > 0) {
                    onProgress(downloadedSize, totalSize);
                }
            });

            fileStream.on('finish', () => {
                fileStream.close();
                resolve(destPath);
            });
            fileStream.on('error', reject);
        });

        req.on('error', reject);
        req.setTimeout(60000, () => { req.destroy(); reject(new Error('Download timeout')); });
        req.end();
    });
}

function decryptAES128(buffer, key, iv) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv || Buffer.alloc(16, 0));
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
}

async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await request(url);
        } catch (e) {
            if (i === maxRetries - 1) throw e;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

class Crawler4KVM {
    constructor() {
        this.cache = new Map();
        this.sessionCookies = '';
    }

    async getPlayPage(playId) {
        const url = `${BASE_URL}/play/${playId}`;
        console.log(`[INFO] 获取播放页面: ${url}`);

        const response = await request(url, {
            headers: { ...HEADERS, 'Cookie': this.sessionCookies }
        });

        if (response.status !== 200) {
            throw new Error(`获取页面失败: HTTP ${response.status}`);
        }

        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            this.sessionCookies = Array.isArray(setCookie)
                ? setCookie.map(c => c.split(';')[0]).join('; ')
                : setCookie.split(';')[0];
        }

        return response.body;
    }

    async analyzePlayPage(playId) {
        const html = await this.getPlayPage(playId);
        console.log('[INFO] 开始分析页面结构...');

        const configMatches = extractPlayerConfig(html);
        console.log(`[INFO] 找到 ${configMatches.length} 个可能的配置项`);

        configMatches.forEach((match, idx) => {
            console.log(`\n--- 配置 #${idx + 1} (${match.type}) ---`);
            console.log(match.match.substring(0, 500));
        });

        const scripts = extractScriptBlocks(html);
        console.log(`\n[INFO] 找到 ${scripts.length} 个相关脚本块`);

        scripts.forEach((script, idx) => {
            console.log(`\n--- 脚本 #${idx + 1} (长度: ${script.content.length}) ---`);
            const preview = script.content.substring(0, 800);
            console.log(preview);
        });

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : playId;

        return {
            html,
            configs: configMatches,
            scripts,
            title,
            playId
        };
    }

    extractVideoUrls(analysisResult) {
        const urls = new Set();
        const { html, configs, scripts } = analysisResult;

        configs.forEach(config => {
            if (config.type === 'url') {
                urls.add(decodeCustomEncode(config.match));
            }
        });

        const urlPatterns = [
            /["'](https?:\/\/[^"']*\.m3u8[^"']*)["']/g,
            /["'](https?:\/\/[^"']*(?:mp4|flv|mkv)[^"']*)["']/g,
            /url\s*:\s*["']([^"']+)["']/g,
            /src\s*:\s*["']([^"']+)["']/g,
            /file\s*:\s*["']([^"']+)["']/g,
            /["']([^"']*4kvm[^"']*(?:m3u8|api|play)[^"']*)["']/gi
        ];

        for (const pattern of urlPatterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                urls.add(decodeCustomEncode(match[1]));
            }
        }

        scripts.forEach(script => {
            for (const pattern of urlPatterns) {
                let match;
                const regex = new RegExp(pattern.source, pattern.flags);
                while ((match = regex.exec(script.content)) !== null) {
                    urls.add(decodeCustomEncode(match[1]));
                }
            }
        });

        return Array.from(urls);
    }

    async resolveM3U8(m3u8Url) {
        console.log(`\n[INFO] 解析M3U8地址: ${m3u8Url}`);
        const response = await fetchWithRetry(m3u8Url);
        const m3u8Content = response.body;
        const parsed = parseM3U8(m3u8Content, m3u8Url);

        if (parsed.isMaster) {
            console.log(`[INFO] 检测到Master Playlist，包含 ${parsed.variants.length} 个画质选项:`);
            parsed.variants.forEach((v, idx) => {
                console.log(`  ${idx + 1}. ${v.resolution || '未知'} (${(v.bandwidth / 1000000).toFixed(2)}Mbps) - ${v.url}`);
            });
            return parsed;
        }

        console.log(`[INFO] Media Playlist: ${parsed.segments.length} 个分片, 总时长: ${Math.round(parsed.duration)}秒`);
        if (parsed.key) {
            console.log(`[INFO] 加密方式: ${parsed.key.method}, Key URL: ${parsed.key.url}`);
        }

        return parsed;
    }

    async downloadVideo(m3u8Url, outputDir = './downloads') {
        const m3u8Data = await this.resolveM3U8(m3u8Url);

        let targetPlaylist = m3u8Data;
        if (m3u8Data.isMaster && m3u8Data.variants.length > 0) {
            const bestQuality = m3u8Data.variants.reduce((prev, curr) =>
                (prev.bandwidth || 0) > (curr.bandwidth || 0) ? prev : curr
            );
            console.log(`\n[INFO] 选择最佳画质: ${bestQuality.resolution || '最高'}`);
            targetPlaylist = await this.resolveM3U8(bestQuality.url);
        }

        if (!targetPlaylist.segments.length) {
            throw new Error('未找到视频分片');
        }

        const outputDirPath = path.resolve(outputDir);
        if (!fs.existsSync(outputDirPath)) fs.mkdirSync(outputDirPath, { recursive: true });

        let keyBuffer = null;
        if (targetPlaylist.key) {
            console.log('\n[INFO] 下载解密密钥...');
            const keyResponse = await fetchWithRetry(targetPlaylist.key.url);
            keyBuffer = keyResponse.raw;
            console.log(`[INFO] 密钥获取成功 (${keyBuffer.length} bytes)`);
        }

        const tsFiles = [];
        const totalSegments = targetPlaylist.segments.length;
        let completedSegments = 0;

        console.log(`\n[INFO] 开始下载 ${totalSegments} 个视频分片...`);
        console.log('=' .repeat(50));

        for (let i = 0; i < targetPlaylist.segments.length; i++) {
            const segment = targetPlaylist.segments[i];
            const tsPath = path.join(outputDirPath, `segment_${String(i).padStart(5, '0')}.ts`);

            try {
                if (fs.existsSync(tsPath)) {
                    completedSegments++;
                    tsFiles.push(tsPath);
                    continue;
                }

                const tsData = await fetchWithRetry(segment.url);

                let dataToSave = tsData.raw;
                if (segment.encrypted && keyBuffer) {
                    dataToSave = decryptAES128(tsData.raw, keyBuffer, targetPlaylist.key.iv);
                }

                fs.writeFileSync(tsPath, dataToSave);
                tsFiles.push(tsPath);
                completedSegments++;

                const progress = Math.round((completedSegments / totalSegments) * 100);
                process.stdout.write(`\r[下载进度] ${completedSegments}/${totalSegments} (${progress}%)`);
            } catch (e) {
                console.error(`\n[ERROR] 分片 ${i + 1} 下载失败: ${e.message}`);
            }
        }

        console.log(`\n${'=' .repeat(50)}`);
        console.log(`[INFO] 下载完成! 共 ${tsFiles.length} 个分片`);

        return {
            segments: tsFiles,
            outputDir: outputDirPath,
            hasKey: keyBuffer !== null
        };
    }

    async crawl(playId, options = {}) {
        console.log('='.repeat(60));
        console.log(`4KVM.TV 视频爬虫`);
        console.log(`目标: ${playId}`);
        console.log('='.repeat(60));

        const analysis = await this.analyzePlayPage(playId);
        const videoUrls = this.extractVideoUrls(analysis);

        console.log(`\n${'=' .repeat(60)}`);
        console.log(`[结果] 标题: ${analysis.title}`);
        console.log(`[结果] 发现 ${videoUrls.length} 个视频地址:`);

        videoUrls.forEach((url, idx) => {
            console.log(`  ${idx + 1}. ${url}`);
        });

        if (options.download && videoUrls.length > 0) {
            const m3u8Url = videoUrls.find(u => u.includes('.m3u8')) || videoUrls[0];
            if (m3u8Url) {
                const result = await this.downloadVideo(m3u8Url, options.outputDir || './downloads');
                console.log(`\n[完成] 视频已保存到: ${result.outputDir}`);
                return { ...analysis, videoUrls, downloadResult: result };
            }
        }

        return { ...analysis, videoUrls };
    }
}

async function main() {
    const args = process.argv.slice(2);
    const playId = args[0];
    const command = args[1];

    if (!playId || playId === '-h' || playId === '--help') {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║           4KVM.TV 视频爬虫 - Cat.js                      ║
╠══════════════════════════════════════════════════════════╣
║  用法:                                                    ║
║    node cat.js <playId> [命令] [选项]                     ║
║                                                          ║
║  命令:                                                    ║
║    analyze   仅分析页面结构和视频地址                      ║
║    download  分析并下载视频                               ║
║                                                          ║
║  选项:                                                    ║
║    --output <目录>  指定输出目录 (默认: ./downloads)       ║
║                                                          ║
║  示例:                                                    ║
║    node cat.js ch43p9mom                                 ║
║    node cat.js ch43p9mom analyze                         ║
║    node cat.js ch43p9mom download --output ./videos      ║
║                                                          ║
║  Play ID 示例 (来自 4kvm.tv):                            ║
║    ch43p9mom  - 黑袍纠察队 第五季 第1集                   ║
║    ch44vpwk4 - 飞驰人生3                                  ║
║    ch459gcgp - 低智商犯罪                                 ║
╚══════════════════════════════════════════════════════════╝
        `);
        return;
    }

    const crawler = new Crawler4KVM();
    const options = {
        download: command === 'download',
        outputDir: args.indexOf('--output') !== -1 ? args[args.indexOf('--output') + 1] : './downloads'
    };

    try {
        const result = await crawler.crawl(playId, options);

        if (command !== 'download') {
            console.log(`
\n提示: 使用以下命令下载视频
  node cat.js ${playId} download
  node cat.js ${playId} download --output ./my_videos
            `);
        }
    } catch (e) {
        console.error(`\n[ERROR] ${e.message}`);
        if (process.env.DEBUG) console.error(e.stack);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { Crawler4KVM, parseM3U8, decryptAES128, request, extractPlayerConfig };
