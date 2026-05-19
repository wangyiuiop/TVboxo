# -*- coding: utf-8 -*-
# 4K影视插件 - 完全修复版本
import re
import sys
import json
from pyquery import PyQuery as pq
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):

    def init(self, extend=""):
        pass

    def getName(self):
        return "4k影视"

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    host = 'https://www.4kvm.tv'

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.4kvm.tv/'
    }

    # 公共方法
    def _normalize_url(self, url):
        """标准化URL处理"""
        if not url:
            return url
        if url.startswith('//'):
            return f"https:{url}"
        elif url.startswith('/'):
            return f"{self.host}{url}"
        return url

    def _extract_video_info(self, item):
        """提取视频信息 - 通用方法"""
        try:
            # 找到视频链接
            a_tag = item('a')
            href = a_tag.attr('href')
            if not href:
                return None
            
            vod_id = self._normalize_url(href)
            if not vod_id:
                return None
            
            # 找到标题
            title = ''
            h2_h3 = item('h1, h2, h3')
            if h2_h3:
                title = h2_h3.text().strip()
            if not title:
                title = a_tag.text().strip()
            if not title:
                img_tag = item('img')
                if img_tag:
                    title = img_tag.attr('alt') or ''
            
            if not title:
                title = '未知标题'
            
            # 找到图片
            img = ''
            img_tag = item('img')
            if img_tag:
                img = img_tag.attr('src') or img_tag.attr('data-src') or ''
                if img:
                    img = self._normalize_url(img)
            
            # 找到备注/评分
            remarks = ''
            rating = item('[class*="rating"], [class*="imdb"], [class*="vote"]')
            if rating:
                remarks = rating.text().strip()
            if not remarks:
                year_tag = item('[class*="year"], [class*="date"], span')
                if year_tag:
                    remarks = year_tag.text().strip()

            return {
                'vod_id': vod_id,
                'vod_name': title,
                'vod_pic': img,
                'vod_remarks': remarks,
                'vod_year': ''
            }
        except Exception:
            return None

    def homeContent(self, filter):
        try:
            html = self.fetch(self.host, headers=self.headers).text
            data = self.getpq(html)
            classes = []
            
            # 提取导航分类 - 基于实际页面结构
            nav_links = data('header a, nav a')
            for link in nav_links.items():
                name = link.text().strip()
                href = link.attr('href')
                
                if name and href:
                    if name in ['首页', '影片下载', '登入', '注冊', '筛选', '观看历史', '4k影视']:
                        continue
                    class_info = {
                        'type_name': name,
                        'type_id': self._normalize_url(href)
                    }
                    classes.append(class_info)
            
            # 去重分类
            unique_classes = []
            seen = set()
            for cls in classes:
                if cls['type_id'] not in seen:
                    seen.add(cls['type_id'])
                    unique_classes.append(cls)
            classes = unique_classes
            
            videos = []
            # 提取首页视频 - 查找所有可能的视频容器
            selectors = [
                'article', 
                '[class*="item"]', 
                '[class*="movie"]',
                '[class*="video"]',
                'li a',
                'div a'
            ]
            
            for selector in selectors:
                items = data(selector)
                for item in items.items():
                    video_info = self._extract_video_info(item)
                    if video_info and video_info['vod_id'] and '/play/' in video_info['vod_id'] or '/movie/' in video_info['vod_id'] or '/tv/' in video_info['vod_id']:
                        # 避免重复
                        if not any(v['vod_id'] == video_info['vod_id'] for v in videos):
                            videos.append(video_info)
                    if len(videos) >= 30:
                        break
                if len(videos) >= 30:
                    break
            
            return {'class': classes, 'list': videos}
        except Exception:
            return {'class': [], 'list': []}

    def homeVideoContent(self):
        pass

    def categoryContent(self, tid, pg, filter, extend):
        try:
            url = tid
            if pg != '1':
                if '?' in tid:
                    url = f"{tid}&page={pg}"
                else:
                    url = f"{tid}/page/{pg}" if not tid.endswith('/') else f"{tid}page/{pg}"
                    
            html = self.fetch(url, headers=self.headers).text
            data = self.getpq(html)
            
            videos = []
            # 使用相同的选择器策略
            selectors = [
                'article', 
                '[class*="item"]', 
                '[class*="movie"]',
                '[class*="video"]',
                'li a',
                'div a'
            ]
            
            for selector in selectors:
                items = data(selector)
                for item in items.items():
                    video_info = self._extract_video_info(item)
                    if video_info and video_info['vod_id']:
                        # 确保链接是合理的视频链接
                        if any(pattern in video_info['vod_id'] for pattern in ['/play/', '/movie/', '/tv/', '/anime/']):
                            if not any(v['vod_id'] == video_info['vod_id'] for v in videos):
                                videos.append(video_info)
                    if len(videos) >= 50:
                        break
                if len(videos) >= 50:
                    break
            
            return {'list': videos, 'page': int(pg), 'pagecount': 9999, 'limit': 30, 'total': 999999}
        except Exception:
            return {'list': [], 'page': int(pg), 'pagecount': 1, 'limit': 30, 'total': 0}

    def detailContent(self, ids):
        try:
            vod_id = next(iter(ids)) if hasattr(ids, '__iter__') and not isinstance(ids, str) else ids
            html = self.fetch(vod_id, headers=self.headers).text
            data = self.getpq(html)
            
            # 获取标题
            vod_name = ''
            h1_tag = data('h1').first()
            if h1_tag:
                vod_name = h1_tag.text().strip()
            
            # 获取海报
            vod_pic = ''
            img_tags = data('img')
            for img in img_tags.items():
                src = img.attr('src')
                if src and ('.jpg' in src or '.png' in src or 'douban' in src or 'tmdb' in src):
                    vod_pic = self._normalize_url(src)
                    break
            
            vod = {
                'vod_id': vod_id,
                'vod_name': vod_name or '未知影片',
                'vod_pic': vod_pic,
                'vod_content': '',
                'vod_year': '', 
                'vod_area': '', 
                'vod_remarks': '', 
                'vod_actor': '', 
                'vod_director': ''
            }
            
            # 提取播放链接
            play_links = []
            
            # 方法1：查找集数选择器
            episode_links = data('[role="link"], a')
            for link in episode_links.items():
                link_text = link.text().strip()
                if link_text and link_text.isdigit():
                    episode_num = int(link_text)
                    if 1 <= episode_num <= 100:  # 支持更长的剧集
                        link_href = link.attr('href')
                        if link_href:
                            full_url = self._normalize_url(link_href)
                            play_links.append(f"第{episode_num}集${full_url}")
            
            # 方法2：直接使用当前页面作为播放链接
            if not play_links:
                # 如果当前已经是播放页面，直接使用
                if '/play/' in vod_id:
                    play_links.append(f"播放${vod_id}")
                else:
                    # 尝试找到播放按钮的链接
                    play_buttons = data('a[href*="/play/"]')
                    if play_buttons:
                        play_btn = play_buttons.first()
                        play_href = self._normalize_url(play_btn.attr('href'))
                        play_links.append(f"播放${play_href}")
                    else:
                        play_links.append(f"播放${vod_id}")
            
            # 去重播放链接
            unique_play_links = []
            seen_urls = set()
            for pl in play_links:
                url_part = pl.split('$')[-1]
                if url_part not in seen_urls:
                    seen_urls.add(url_part)
                    unique_play_links.append(pl)
            
            vod['vod_play_from'] = '4K影视'
            vod['vod_play_url'] = '#'.join(unique_play_links)
            
            return {'list': [vod]}
        except Exception:
            return {'list': []}

    def searchContent(self, key, quick, pg="1"):
        try:
            search_url = f"{self.host}/search?q={key}"
            if pg != "1":
                search_url += f"&page={pg}"
                
            html = self.fetch(search_url, headers=self.headers).text
            data = self.getpq(html)
            
            videos = []
            # 使用相同的选择器
            selectors = [
                'article', 
                '[class*="item"]', 
                '[class*="movie"]',
                '[class*="video"]',
                'li a',
                'div a'
            ]
            
            for selector in selectors:
                items = data(selector)
                for item in items.items():
                    video_info = self._extract_video_info(item)
                    if video_info and video_info['vod_id']:
                        if any(pattern in video_info['vod_id'] for pattern in ['/play/', '/movie/', '/tv/', '/anime/']):
                            if not any(v['vod_id'] == video_info['vod_id'] for v in videos):
                                videos.append(video_info)
                    if len(videos) >= 30:
                        break
                if len(videos) >= 30:
                    break
            
            return {'list': videos, 'page': int(pg)}
        except Exception:
            return {'list': [], 'page': int(pg)}

    def playerContent(self, flag, id, vipFlags):
        try:
            # 获取播放页面的HTML
            headers = self.headers.copy()
            headers['Referer'] = self.host
            response = self.fetch(id, headers=headers)
            html = response.text
            
            video_url = None
            
            # 策略1：直接查找 /video/play API链接
            api_match = re.search(r'(/video/play\?[^"\'\s]+)', html)
            if api_match:
                api_url = self._normalize_url(api_match.group(1))
                try:
                    api_response = self.fetch(api_url, headers=headers)
                    if api_response.status_code == 200:
                        api_content = api_response.text
                        
                        # 尝试JSON解析
                        try:
                            json_data = json.loads(api_content)
                            # 查找常见的视频URL字段
                            url_fields = ['url', 'video_url', 'src', 'play_url', 'm3u8', 'data.url', 'data.video_url']
                            for field in url_fields:
                                if '.' in field:
                                    parts = field.split('.')
                                    val = json_data
                                    for p in parts:
                                        if val and isinstance(val, dict) and p in val:
                                            val = val[p]
                                        else:
                                            val = None
                                            break
                                    if val:
                                        video_url = val
                                        break
                                elif field in json_data:
                                    video_url = json_data[field]
                                    break
                        except Exception:
                            # 如果不是JSON，直接查找URL
                            url_match = re.search(r'https?://[^\s"\'<>]+(?:\.m3u8|\.mp4)', api_content)
                            if url_match:
                                video_url = url_match.group(0)
                except Exception:
                    pass
            
            # 策略2：直接在HTML中查找m3u8链接
            if not video_url:
                m3u8_matches = re.findall(r'https?://[^\s"\'<>]+\.m3u8', html)
                if m3u8_matches:
                    video_url = m3u8_matches[0]
            
            # 策略3：查找video标签的src
            if not video_url:
                video_src_match = re.search(r'<video[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
                if video_src_match:
                    video_url = self._normalize_url(video_src_match.group(1))
            
            # 策略4：查找iframe的src
            if not video_url:
                iframe_match = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
                if iframe_match:
                    video_url = self._normalize_url(iframe_match.group(1))
            
            # 如果还是没找到，使用页面本身让播放器去解析
            if not video_url:
                video_url = id
            
            # 确定是否需要解析
            is_direct = any(ext in video_url.lower() for ext in ['.m3u8', '.mp4', '.flv', '.avi', '.mkv', '.webm'])
            parse_flag = 0 if is_direct else 1
            
            return {'parse': parse_flag, 'url': video_url, 'header': headers}
            
        except Exception:
            return {'parse': 1, 'url': id, 'header': self.headers}

    def localProxy(self, param):
        pass

    def liveContent(self, url):
        pass

    def getpq(self, text):
        """创建PyQuery对象"""
        try:
            return pq(text)
        except Exception:
            try:
                return pq(text.encode('utf-8'))
            except Exception:
                return pq('')
