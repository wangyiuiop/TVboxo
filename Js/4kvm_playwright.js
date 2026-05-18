/**
 * 4kvm.tv 视频爬虫 - Playwright版本
 * 
 * 功能：
 * 1. 获取视频列表
 * 2. 获取视频详情和剧集列表
 * 3. 获取视频播放地址（M3U8）
 * 
 * 使用方法：
 * 1. 安装依赖：npm install playwright axios
 * 2. 运行脚本：node 4kvm_playwright.js
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://www.4kvm.tv';

class FourKVMPlayer {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async initialize() {
        console.log('正在初始化浏览器...');
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.context = await this.browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        this.page = await this.context.newPage();
        console.log('浏览器初始化完成');
    }

    async getVideoPlayUrl(videoId) {
        try {
            console.log(`正在获取视频 ${videoId} 的播放地址...`);
            
            await this.page.goto(`${BASE_URL}/play/${videoId}`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            await this.page.waitForTimeout(3000);

            const playUrl = await this.page.evaluate(() => {
                const requests = window.performance.getEntriesByType('resource');
                for (const req of requests) {
                    if (req.name.includes('/video/play') || req.name.includes('.m3u8')) {
                        return req.name;
                    }
                }

                const iframes = document.querySelectorAll('iframe');
                for (const iframe of iframes) {
                    const src = iframe.src || iframe.getAttribute('data-src');
                    if (src && (src.includes('m3u8') || src.includes('player'))) {
                        return src;
                    }
                }

                const scripts = document.querySelectorAll('script');
                for (const script of scripts) {
                    const content = script.textContent || '';
                    const match = content.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\\s"'<>]*)/);
                    if (match) {
                        return match[1];
                    }
                }

                return null;
            });

            if (playUrl) {
                console.log(`✓ 成功获取播放地址: ${playUrl}`);
                return playUrl;
            }

            const artplayerInstance = await this.page.evaluate(() => {
                return window.artplayer ? window.artplayer.url : null;
            });

            if (artplayerInstance) {
                console.log(`✓ 通过ArtPlayer实例获取地址: ${artplayerInstance}`);
                return artplayerInstance;
            }

            console.log('未能获取播放地址，尝试从页面元素提取...');
            const directUrl = await this.page.evaluate(() => {
                const player = document.querySelector('.art-video-player video');
                if (player && player.src) {
                    return player.src;
                }
                
                const source = document.querySelector('.art-video-player source');
                if (source && source.src) {
                    return source.src;
                }
                
                return null;
            });

            if (directUrl) {
                console.log(`✓ 从视频元素获取地址: ${directUrl}`);
                return directUrl;
            }

            console.log(`✗ 无法获取视频 ${videoId} 的播放地址`);
            return null;
        } catch (error) {
            console.error(`获取视频 ${videoId} 播放地址失败:`, error.message);
            return null;
        }
    }

    async getVideoList(category = 'movie', page = 1) {
        try {
            console.log(`正在获取${category}列表，第${page}页...`);
            
            await this.page.goto(`${BASE_URL}/${category}`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            await this.page.waitForTimeout(2000);

            const videos = await this.page.evaluate(() => {
                const items = document.querySelectorAll('.video-item, .vod-item, .module-item');
                const results = [];
                
                items.forEach(item => {
                    const link = item.querySelector('a');
                    const title = item.querySelector('.title, .name, h3');
                    const cover = item.querySelector('img');
                    const score = item.querySelector('.score, .rating');
                    
                    if (link) {
                        const href = link.href || link.getAttribute('href');
                        const match = href.match(/\/play\/([a-zA-Z0-9]+)/);
                        if (match) {
                            results.push({
                                id: match[1],
                                title: title ? title.textContent.trim() : '',
                                cover: cover ? cover.src || cover.getAttribute('data-src') : '',
                                score: score ? score.textContent.trim() : ''
                            });
                        }
                    }
                });
                
                return results;
            });

            console.log(`✓ 获取到 ${videos.length} 个视频`);
            return videos;
        } catch (error) {
            console.error('获取视频列表失败:', error.message);
            return [];
        }
    }

    async getVideoDetail(videoId) {
        try {
            console.log(`正在获取视频 ${videoId} 的详情...`);
            
            await this.page.goto(`${BASE_URL}/play/${videoId}`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            await this.page.waitForTimeout(2000);

            const detail = await this.page.evaluate(() => {
                const title = document.querySelector('h1, .title, .video-title');
                const cover = document.querySelector('.cover, .poster, .video-cover img');
                const description = document.querySelector('.description, .intro, .synopsis');
                
                const episodes = [];
                const episodeItems = document.querySelectorAll('.episode-item, .play-list a, .episode a');
                episodeItems.forEach((item, index) => {
                    const href = item.href || item.getAttribute('href');
                    const match = href && href.match(/\/play\/([a-zA-Z0-9]+)/);
                    if (match) {
                        episodes.push({
                            index: index + 1,
                            title: item.textContent.trim(),
                            id: match[1]
                        });
                    }
                });

                return {
                    id: videoId,
                    title: title ? title.textContent.trim() : '',
                    cover: cover ? cover.src || cover.getAttribute('data-src') : '',
                    description: description ? description.textContent.trim() : '',
                    episodes: episodes
                };
            });

            console.log(`✓ 获取视频详情: ${detail.title}`);
            console.log(`  集数: ${detail.episodes.length} 集`);
            return detail;
        } catch (error) {
            console.error('获取视频详情失败:', error.message);
            return null;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('浏览器已关闭');
        }
    }
}

async function main() {
    const player = new FourKVMPlayer();
    
    try {
        await player.initialize();

        console.log('\n========== 4kvm.tv 爬虫测试 ==========\n');

        const videos = await player.getVideoList('movie', 1);
        if (videos.length > 0) {
            console.log('\n视频列表示例:');
            videos.slice(0, 3).forEach((video, index) => {
                console.log(`${index + 1}. ${video.title} (${video.id})`);
            });

            const firstVideo = videos[0];
            console.log(`\n测试获取第一个视频的详情和播放地址...`);
            
            const detail = await player.getVideoDetail(firstVideo.id);
            if (detail) {
                console.log(`\n视频标题: ${detail.title}`);
                console.log(`集数: ${detail.episodes.length}`);
                
                if (detail.episodes.length > 0) {
                    const firstEpisode = detail.episodes[0];
                    console.log(`\n测试第一集: ${firstEpisode.title} (${firstEpisode.id})`);
                    
                    const playUrl = await player.getVideoPlayUrl(firstEpisode.id);
                    if (playUrl) {
                        console.log(`播放地址: ${playUrl}`);
                    }
                }
            }
        }

        console.log('\n========== 测试完成 ==========\n');
        
    } catch (error) {
        console.error('程序执行失败:', error);
    } finally {
        await player.close();
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = FourKVMPlayer;
