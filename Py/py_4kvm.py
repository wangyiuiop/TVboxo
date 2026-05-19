# -*- coding: utf-8 -*-
# 4K影视插件 - 修复版本
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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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

    def _extract_video_basic(self, item):
        """提取视频基本信息"""
        try:
            link = self._normalize_url(item('a').attr('href') or item('a').attr('href') or item('a').attr('href'))
            if not link:
                return None

            title = item('a').text().strip() or item('img').attr('alt') or '未知标题'
            
            img = self._normalize_url(item('img').attr('src') or item('img').attr('data-src'))
            
            remarks = item('.rating, .imdb, .vote').text().strip() or item('.year, .date, span').text().strip() or ''

            return {
                'vod_id': link,
                'vod_name': title,
                'vod_pic': img or '',
                'vod_remarks': remarks,
                'vod_year': ''
            }
        except Exception as e:
            return None

    def homeContent(self, filter):
        try:
            data = self.getpq(self.fetch(self.host, headers=self.headers).text)
            classes = []
            
            # 提取导航分类
            nav_items = data('header nav ul li')
            for k in nav_items.items():
                link_elem = k.children('a').eq(0)
                link = self._normalize_url(link_elem.attr('href'))
                name = link_elem.text().strip()
                
                if link and name and name not in ['首页', '影片下载', '登入', '注冊', '筛选', '观看历史']:
                    class_info = {'type_name': name, 'type_id': link}
                    classes.append(class_info)
            
            videos = []
            # 提取首页推荐视频
            items = data('article, [class*="item"] a')
            for item in items.items():
                video_info = self._extract_video_basic(item)
                if video_info and video_info['vod_id']:
                    videos.append(video_info)
            
            return {'class': classes, 'list': videos}
        except Exception as e:
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
                    url = f"{tid}/page/{pg}"
                    
            data = self.getpq(self.fetch(url, headers=self.headers).text)
            
            videos = []
            items = data('article, [class*="item"] a')
            for item in items.items():
                video_info = self._extract_video_basic(item)
                if video_info and video_info['vod_id']:
                    videos.append(video_info)
            
            return {'list': videos, 'page': int(pg), 'pagecount': 9999, 'limit': 30, 'total': 999999}
        except Exception as e:
            return {'list': [], 'page': int(pg), 'pagecount': 1, 'limit': 30, 'total': 0}

    def detailContent(self, ids):
        try:
            vod_id = next(iter(ids)) if hasattr(ids, '__iter__') and not isinstance(ids, str) else ids
            data = self.getpq(self.fetch(vod_id, headers=self.headers).text)
            
            vod = {
                'vod_id': vod_id,
                'vod_name': data('h1').first().text().strip(),
                'vod_pic': self._normalize_url(data('img').first().attr('src')),
                'vod_content': '',
                'vod_year': '', 
                'vod_area': '', 
                'vod_remarks': '', 
                'vod_actor': '', 
                'vod_director': ''
            }
            
            # 提取播放列表
            play_links = []
            # 查找集数链接
            episode_links = data('[role="link"]')
            for link in episode_links.items():
                link_text = link.text().strip()
                if link_text and link_text.isdigit():
                    episode_num = int(link_text)
                    if 1 <= episode_num <= 50:
                        link_href = link.attr('href') or ''
                        if link_href and '/play/' in link_href:
                            full_url = self._normalize_url(link_href)
                        else:
                            full_url = f"{vod_id}?ep={episode_num}"
                        play_links.append(f"第{episode_num}集${full_url}")
            
            # 如果没有找到具体的集数，就用当前页面
            if not play_links:
                play_links.append(f"播放${vod_id}")
            
            vod['vod_play_from'] = '4K影视'
            vod['vod_play_url'] = '#'.join(play_links)
            
            return {'list': [vod]}
        except Exception as e:
            return {'list': []}

    def searchContent(self, key, quick, pg="1"):
        try:
            search_url = f"{self.host}/search?q={key}"
            if pg != "1":
                search_url += f"&page={pg}"
                
            data = self.getpq(self.fetch(search_url, headers=self.headers).text)
            
            videos = []
            items = data('article, [class*="item"] a')
            for item in items.items():
                video_info = self._extract_video_basic(item)
                if video_info and video_info['vod_id']:
                    videos.append(video_info)
            
            return {'list': videos, 'page': int(pg)}
        except Exception as e:
            return {'list': [], 'page': int(pg)}

    def playerContent(self, flag, id, vipFlags):
        try:
            # 首先获取播放页面的HTML
            response = self.fetch(id, headers=self.headers)
            html = response.text
            
            # 尝试从HTML中提取视频链接或者相关的API参数
            import re
            
            # 查找视频ID
            vod_id_match = re.search(r'/play/([a-zA-Z0-9]+)', id)
            if vod_id_match:
                vod_id = vod_id_match.group(1)
            else:
                vod_id = id.split('/')[-1].split('?')[0]
            
            # 查找API调用模式
            api_patterns = [
                r'(/video/play\?[^\'"]+)',
                r'"video_url"\s*:\s*"([^"]+)"',
                r'"url"\s*:\s*"([^"]+)"',
                r'src="([^"]*m3u8[^"]*)"',
                r'video.*?src=["\']([^"\']+)["\']'
            ]
            
            video_url = None
            for pattern in api_patterns:
                matches = re.findall(pattern, html)
                if matches:
                    for match in matches:
                        if 'm3u8' in match or '.mp4' in match:
                            video_url = self._normalize_url(match)
                            break
                        elif '/video/play' in match:
                            api_url = self._normalize_url(match)
                            try:
                                api_response = self.fetch(api_url, headers=self.headers)
                                if api_response.status_code == 200:
                                    api_data = api_response.text
                                    # 尝试解析API响应
                                    if api_data.startswith('{'):
                                        try:
                                            json_data = json.loads(api_data)
                                            if 'url' in json_data:
                                                video_url = json_data['url']
                                            elif 'video_url' in json_data:
                                                video_url = json_data['video_url']
                                            elif 'data' in json_data:
                                                if isinstance(json_data['data'], dict):
                                                    if 'url' in json_data['data']:
                                                        video_url = json_data['data']['url']
                                        except:
                                            # 尝试直接匹配URL
                                            url_match = re.search(r'https?://[^\'"\s]+', api_data)
                                            if url_match:
                                                video_url = url_match.group(0)
                                    else:
                                        url_match = re.search(r'https?://[^\'"\s]+', api_data)
                                        if url_match:
                                            video_url = url_match.group(0)
                            except:
                                continue
                    if video_url:
                        break
            
            # 如果没找到，使用页面本身作为可解析的链接
            if not video_url:
                video_url = id
            
            parse_flag = 0 if any(ext in video_url.lower() for ext in ['.m3u8', '.mp4', '.flv', '.avi', '.mkv']) else 1
            
            return {'parse': parse_flag, 'url': video_url, 'header': self.headers}
            
        except Exception as e:
            return {'parse': 1, 'url': id, 'header': self.headers}

    def localProxy(self, param):
        pass

    def liveContent(self, url):
        pass

    def getpq(self, text):
        """创建PyQuery对象"""
        try:
            return pq(text)
        except:
            try:
                return pq(text.encode('utf-8'))
            except:
                return pq('')
