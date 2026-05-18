#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
4kvm.tv 视频爬虫 - Python版本

功能：
1. 获取视频分类列表
2. 获取视频详情和剧集
3. 获取视频播放地址（M3U8）

依赖：
pip install requests aiohttp playwright
playwright install chromium
"""

import asyncio
import json
import re
import time
import hashlib
import base64
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse
import requests
from playwright.async_api import async_playwright

BASE_URL = 'https://www.4kvm.tv'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': BASE_URL,
}

session = requests.Session()
session.headers.update(HEADERS)


class FourKVMCrawler:
    """4kvm.tv 爬虫类"""
    
    def __init__(self):
        self.base_url = BASE_URL
        self.session = session
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
    
    async def initialize_browser(self):
        """初始化浏览器"""
        print("正在初始化浏览器...")
        self.playwright = async_playwright()
        await self.playwright.start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent=HEADERS['User-Agent']
        )
        self.page = await self.context.new_page()
        print("浏览器初始化完成")
    
    async def close_browser(self):
        """关闭浏览器"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        print("浏览器已关闭")
    
    def generate_signature(self, video_id: str, timestamp: int) -> str:
        """生成签名"""
        data = f"{video_id}{timestamp}"
        return hashlib.md5(data.encode()).hexdigest()
    
    def generate_encrypted_key(self, video_id: str, timestamp: int) -> str:
        """生成加密密钥"""
        key = f"4kvm_secret_{video_id}"
        data = str(timestamp)
        encrypted = base64.b64encode(data.encode()).decode()
        return encrypted
    
    def get_video_play_url(self, video_id: str) -> Optional[str]:
        """
        通过API获取视频播放地址
        
        由于视频地址需要WASM动态生成，这里提供两种方案：
        1. 使用浏览器自动化（推荐）
        2. 尝试直接访问API
        """
        try:
            timestamp = int(time.time() * 1000)
            signature = self.generate_signature(video_id, timestamp)
            encrypted_key = self.generate_encrypted_key(video_id, timestamp)
            
            play_url = f"{self.base_url}/video/play?p=33752&v={video_id}&q=1080&s={signature}&t={timestamp}&k={encrypted_key}"
            
            print(f"播放URL: {play_url}")
            
            response = self.session.get(play_url, timeout=10)
            
            if response.status_code == 200:
                content = response.text
                if '.m3u8' in content:
                    return content.strip()
                
                try:
                    data = response.json()
                    if 'url' in data:
                        return data['url']
                    elif 'data' in data and isinstance(data['data'], dict) and 'url' in data['data']:
                        return data['data']['url']
                except:
                    pass
                
                return content
            else:
                print(f"请求失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"获取播放地址失败: {e}")
            return None
    
    async def get_video_play_url_browser(self, video_id: str) -> Optional[str]:
        """
        使用浏览器自动化获取视频播放地址（推荐方法）
        """
        try:
            print(f"正在获取视频 {video_id} 的播放地址...")
            
            await self.page.goto(f"{self.base_url}/play/{video_id}", 
                                wait_until='networkidle', 
                                timeout=30000)
            
            await asyncio.sleep(3)
            
            m3u8_url = await self.page.evaluate('''() => {
                const requests = window.performance.getEntriesByType('resource');
                for (const req of requests) {
                    if (req.name.includes('.m3u8')) {
                        return req.name;
                    }
                }
                
                const scripts = document.querySelectorAll('script');
                for (const script of scripts) {
                    const content = script.textContent || '';
                    const match = content.match(/(https?://[^\\s"'<>]+\\.m3u8[^\\s"'<>]*)/);
                    if (match) return match[1];
                }
                
                const video = document.querySelector('video');
                if (video && video.src) return video.src;
                
                const source = document.querySelector('source');
                if (source && source.src) return source.src;
                
                return null;
            }''')
            
            if m3u8_url:
                print(f"✓ 成功获取M3U8地址: {m3u8_url}")
                return m3u8_url
            
            print(f"✗ 无法获取视频 {video_id} 的播放地址")
            return None
            
        except Exception as e:
            print(f"浏览器获取播放地址失败: {e}")
            return None
    
    def get_video_list(self, category: str = 'movie', page: int = 1) -> List[Dict]:
        """获取视频列表"""
        try:
            print(f"正在获取{category}列表，第{page}页...")
            
            url = f"{self.base_url}/{category}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code != 200:
                print(f"请求失败: {response.status_code}")
                return []
            
            html = response.text
            
            videos = []
            
            patterns = [
                r'<a[^>]*href="/play/([a-zA-Z0-9]+)"[^>]*>.*?<img[^>]*src="([^"]*)"[^>]*>.*?<[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</[^>]*>',
                r'<div[^>]*class="[^"]*video-item[^"]*"[^>]*>.*?<a[^>]*href="/play/([a-zA-Z0-9]+)".*?<img[^>]*src="([^"]*)"[^>]*>.*?<[^>]*>([^<]+)</[^>]*>',
                r'data-id="([a-zA-Z0-9]+)"[^>]*data-title="([^"]*)"[^>]*data-cover="([^"]*)"',
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, html, re.DOTALL)
                for match in matches:
                    if len(match) >= 2:
                        video_id = match[0]
                        title = match[2] if len(match) >= 3 else ''
                        cover = match[1] if len(match) >= 2 else ''
                        
                        if video_id and video_id not in [v['id'] for v in videos]:
                            videos.append({
                                'id': video_id,
                                'title': title.strip() if title else '',
                                'cover': cover.strip() if cover else ''
                            })
            
            print(f"✓ 获取到 {len(videos)} 个视频")
            return videos
            
        except Exception as e:
            print(f"获取视频列表失败: {e}")
            return []
    
    async def get_video_detail_browser(self, video_id: str) -> Optional[Dict]:
        """使用浏览器获取视频详情"""
        try:
            print(f"正在获取视频 {video_id} 的详情...")
            
            await self.page.goto(f"{self.base_url}/play/{video_id}",
                               wait_until='networkidle',
                               timeout=30000)
            
            await asyncio.sleep(2)
            
            detail = await self.page.evaluate('''() => {
                const title = document.querySelector('h1, .title, .video-title')?.textContent?.trim() || '';
                const cover = document.querySelector('.cover img, .poster img, .video-cover img')?.src || '';
                const description = document.querySelector('.description, .intro, .synopsis')?.textContent?.trim() || '';
                
                const episodes = [];
                const episodeItems = document.querySelectorAll('.episode-item a, .play-list a, .episode a, .episode-item');
                episodeItems.forEach((item, index) => {
                    const href = item.href || item.getAttribute('href') || '';
                    const match = href.match(/\\/play\\/([a-zA-Z0-9]+)/);
                    if (match) {
                        episodes.push({
                            index: index + 1,
                            title: item.textContent?.trim() || `第${index + 1}集`,
                            id: match[1]
                        });
                    }
                });
                
                return { title, cover, description, episodes };
            }''')
            
            print(f"✓ 获取视频详情: {detail.get('title', '')}")
            print(f"  集数: {len(detail.get('episodes', []))}")
            return detail
            
        except Exception as e:
            print(f"获取视频详情失败: {e}")
            return None
    
    def get_categories(self) -> Dict[str, str]:
        """获取分类信息"""
        return {
            'movie': '电影',
            'tv': '电视剧',
            'anime': '动漫',
            'list': '片单'
        }


async def main():
    """主函数"""
    crawler = FourKVMCrawler()
    
    try:
        print("\n========== 4kvm.tv 爬虫测试 ==========\n")
        
        categories = crawler.get_categories()
        print("可用分类:")
        for key, name in categories.items():
            print(f"  - {name}: /{key}")
        
        print("\n1. 测试获取电影列表...")
        videos = crawler.get_video_list('movie', 1)
        if videos:
            print(f"\n前3个视频:")
            for i, video in enumerate(videos[:3]):
                print(f"  {i+1}. {video['title']} ({video['id']})")
        
        print("\n2. 初始化浏览器...")
        await crawler.initialize_browser()
        
        if videos:
            first_video = videos[0]
            print(f"\n3. 测试获取视频详情: {first_video['title']}")
            detail = await crawler.get_video_detail_browser(first_video['id'])
            
            if detail and detail.get('episodes'):
                first_episode = detail['episodes'][0]
                print(f"\n4. 测试获取播放地址: {first_episode['title']}")
                play_url = await crawler.get_video_play_url_browser(first_episode['id'])
                if play_url:
                    print(f"   播放地址: {play_url[:100]}...")
        
        print("\n========== 测试完成 ==========\n")
        
    except Exception as e:
        print(f"程序执行失败: {e}")
    finally:
        await crawler.close_browser()


if __name__ == '__main__':
    asyncio.run(main())
