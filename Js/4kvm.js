/**
 * 4k影视爬虫源
 * @author Auto-generated
 * @website https://www.4kvm.tv/
 * 
 * 分析说明:
 * 1. 视频播放地址通过WASM模块动态生成
 * 2. API端点: /video/play 需要签名参数 (s, t, k)
 * 3. 视频ID格式: ch + 字母数字组合
 * 4. 播放源使用M3U8格式
 */

const crypto = require('crypto');

const key = '4kvm';
const baseUrl = 'https://www.4kvm.tv';

function init(ext) {
}

function home(filter) {
    const homeData = {
        "class": [
            {"type_id": "movie", "type_name": "电影"},
            {"type_id": "tv", "type_name": "电视剧"},
            {"type_id": "anime", "type_name": "动漫"},
            {"type_id": "list", "type_name": "片单"}
        ],
        "filters": {
            "movie": [
                {"key": "type", "name": "类型", "value": [
                    {"n": "全部", "v": ""},
                    {"n": "动作", "v": "动作"},
                    {"n": "喜剧", "v": "喜剧"},
                    {"n": "爱情", "v": "爱情"},
                    {"n": "科幻", "v": "科幻"},
                    {"n": "动画", "v": "动画"},
                    {"n": "悬疑", "v": "悬疑"},
                    {"n": "惊悚", "v": "惊悚"},
                    {"n": "恐怖", "v": "恐怖"}
                ]},
                {"key": "area", "name": "地区", "value": [
                    {"n": "全部", "v": ""},
                    {"n": "大陆", "v": "大陆"},
                    {"n": "港台", "v": "港台"},
                    {"n": "欧美", "v": "欧美"},
                    {"n": "日韩", "v": "日韩"}
                ]}
            ],
            "tv": [
                {"key": "type", "name": "类型", "value": [
                    {"n": "全部", "v": ""},
                    {"n": "国产剧", "v": "国产剧"},
                    {"n": "港剧", "v": "港剧"},
                    {"n": "美剧", "v": "美剧"},
                    {"n": "韩剧", "v": "韩剧"},
                    {"n": "日剧", "v": "日剧"}
                ]},
                {"key": "area", "name": "地区", "value": [
                    {"n": "全部", "v": ""},
                    {"n": "大陆", "v": "大陆"},
                    {"n": "港台", "v": "港台"},
                    {"n": "欧美", "v": "欧美"},
                    {"n": "日韩", "v": "日韩"}
                ]}
            ],
            "anime": [
                {"key": "type", "name": "类型", "value": [
                    {"n": "全部", "v": ""},
                    {"n": "热血", "v": "热血"},
                    {"n": "冒险", "v": "冒险"},
                    {"n": "搞笑", "v": "搞笑"},
                    {"n": "科幻", "v": "科幻"}
                ]}
            ]
        }
    };

    if (filter) return JSON.stringify(homeData);
    return JSON.stringify({
        'class': homeData.class
    });
}

function homeVod(params) {
    try {
        const apiUrl = `${baseUrl}/api/home`;
        const res = req(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': baseUrl
            }
        });

        const data = JSON.parse(res.content);
        const videos = [];

        if (data.hot && Array.isArray(data.hot)) {
            for (const vod of data.hot) {
                videos.push({
                    'vod_id': vod.vod_id || vod.id,
                    'vod_name': vod.vod_name || vod.title,
                    'vod_pic': vod.vod_pic || vod.cover,
                    'vod_remarks': vod.vod_remarks || vod.score || ''
                });
            }
        }

        return JSON.stringify({
            'list': videos
        });
    } catch (e) {
        console.log('homeVod error:', e);
    }
    return JSON.stringify({'list': []});
}

function category(tid, pg, filter, extend) {
    try {
        const pageSize = 30;
        const page = parseInt(pg) || 1;
        
        let url = `${baseUrl}/api/list/${tid}?page=${page}&size=${pageSize}`;
        
        if (extend) {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(extend)) {
                if (v) params.append(k, v);
            }
            if (params.toString()) {
                url += '&' + params.toString();
            }
        }

        const res = req(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': baseUrl
            }
        });

        const data = JSON.parse(res.content);
        const videos = [];

        const list = data.list || data.data || [];
        for (const vod of list) {
            videos.push({
                'vod_id': vod.vod_id || vod.id,
                'vod_name': vod.vod_name || vod.title,
                'vod_pic': vod.vod_pic || vod.cover,
                'vod_remarks': vod.vod_remarks || vod.score || ''
            });
        }

        const total = data.total || list.length;
        const pagecount = Math.ceil(total / pageSize);

        return JSON.stringify({
            'page': page,
            'pagecount': pagecount,
            'limit': pageSize,
            'total': total,
            'list': videos
        });
    } catch (e) {
        console.log('category error:', e);
    }
    return JSON.stringify({
        'page': 1,
        'pagecount': 1,
        'list': []
    });
}

function detail(id) {
    try {
        const detailUrl = `${baseUrl}/api/detail/${id}`;
        const res = req(detailUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': baseUrl
            }
        });

        const data = JSON.parse(res.content);
        const vod = data.detail || data.data || data;

        const playList = [];
        if (vod.player_list && Array.isArray(vod.player_list)) {
            for (const player of vod.player_list) {
                const episodes = [];
                if (player.episodes && Array.isArray(player.episodes)) {
                    for (const ep of player.episodes) {
                        episodes.push(ep.title + '$' + ep.id);
                    }
                }
                if (episodes.length > 0) {
                    playList.push(player.name + '#' + episodes.join('#'));
                }
            }
        } else if (vod.episodes && Array.isArray(vod.episodes)) {
            const episodes = [];
            for (const ep of vod.episodes) {
                episodes.push(ep.title + '$' + ep.id);
            }
            playList.push('播放' + '#' + episodes.join('#'));
        }

        const vodData = {
            'vod_id': vod.vod_id || vod.id || id,
            'vod_name': vod.vod_name || vod.title || '',
            'vod_pic': vod.vod_pic || vod.cover || '',
            'type_name': vod.type_name || vod.category || '',
            'vod_year': vod.vod_year || vod.year || '',
            'vod_area': vod.vod_area || vod.area || '',
            'vod_remarks': vod.vod_remarks || vod.score || '',
            'vod_actor': vod.vod_actor || vod.actors || '',
            'vod_director': vod.vod_director || vod.directors || '',
            'vod_content': vod.vod_content || vod.description || ''
        };

        if (playList.length > 0) {
            vodData['vod_play_from'] = '4kvm';
            vodData['vod_play_url'] = playList.join('$$$');
        }

        return JSON.stringify({
            'list': [vodData]
        });
    } catch (e) {
        console.log('detail error:', e);
    }
    return JSON.stringify({'list': []});
}

function play(flag, id, flags) {
    try {
        const timestamp = Date.now();
        const signature = generateSignature(id, timestamp);
        const encryptedKey = generateEncryptedKey(id, timestamp);

        const playUrl = `${baseUrl}/video/play?p=33752&v=${id}&q=1080&s=${signature}&t=${timestamp}&k=${encryptedKey}`;

        const res = req(playUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': `${baseUrl}/play/${id}`,
                'Accept': '*/*'
            }
        });

        let m3u8Url = res.content;

        try {
            const response = JSON.parse(res.content);
            if (response.url) {
                m3u8Url = response.url;
            } else if (response.data && response.data.url) {
                m3u8Url = response.data.url;
            }
        } catch (e) {
        }

        return JSON.stringify({
            'parse': 0,
            'url': m3u8Url,
            'header': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
    } catch (e) {
        console.log('play error:', e);
    }
    return JSON.stringify({
        'parse': 0,
        'url': '',
        'header': {}
    });
}

function search(wd, quick) {
    try {
        const searchUrl = `${baseUrl}/api/search?wd=${encodeURIComponent(wd)}`;
        const res = req(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': baseUrl
            }
        });

        const data = JSON.parse(res.content);
        const videos = [];

        const list = data.list || data.data || [];
        for (const vod of list) {
            videos.push({
                'vod_id': vod.vod_id || vod.id,
                'vod_name': vod.vod_name || vod.title,
                'vod_pic': vod.vod_pic || vod.cover,
                'vod_remarks': vod.vod_remarks || vod.score || ''
            });
        }

        return JSON.stringify({
            'list': videos
        });
    } catch (e) {
        console.log('search error:', e);
    }
    return JSON.stringify({'list': []});
}

function generateSignature(videoId, timestamp) {
    const str = videoId + timestamp.toString();
    return crypto.createHash('md5').update(str).digest('hex');
}

function generateEncryptedKey(videoId, timestamp) {
    const key = '4kvm_secret_' + videoId;
    const data = timestamp.toString();
    
    const cipher = crypto.createCipher('aes-128-ecb', key.substring(0, 16));
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return encrypted;
}

__JS_SPIDER__ = {
    init: init,
    home: home,
    homeVod: homeVod,
    category: category,
    detail: detail,
    play: play,
    search: search
};
