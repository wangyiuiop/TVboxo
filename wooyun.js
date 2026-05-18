import { _ } from 'assets://js/lib/cat.js';

const HOST = 'https://wooyun.tv';
const UA_PC = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

async function request(url, method = 'get', data = null) {
    const res = await req(url, {
        method: method,
        data: data,
        headers: {
            'User-Agent': UA_PC,
            'Referer': HOST + '/',
            'Origin': HOST,
            'Content-Type': method.toLowerCase() === 'post' ? 'application/json' : 'application/x-www-form-urlencoded'
        },
        timeout: 10000
    });
    return JSON.parse(res.content);
}

// 预定义的筛选配置（基于API返回的数据）
const FILTER_CONFIG = {
    // 类型
    genre: [
        { key: 'action', name: '动作' },
        { key: 'comedy', name: '喜剧' },
        { key: 'drama', name: '剧情' },
        { key: 'romance', name: '爱情' },
        { key: 'thriller', name: '惊悚' },
        { key: 'horror', name: '恐怖' },
        { key: 'sci_fi', name: '科幻' },
        { key: 'fantasy', name: '奇幻' },
        { key: 'war', name: '战争' },
        { key: 'history', name: '历史' },
        { key: 'adventure', name: '冒险' },
        { key: 'crime', name: '犯罪' }
    ],
    // 地区
    region: [
        { key: 'china', name: '大陆' },
        { key: 'hong_kong', name: '香港' },
        { key: 'taiwan', name: '台湾' },
        { key: 'japan', name: '日本' },
        { key: 'korea', name: '韩国' },
        { key: 'usa', name: '美国' },
        { key: 'uk', name: '英国' }
    ],
    // 语言
    language: [
        { key: 'chinese', name: '中文' },
        { key: 'english', name: '英语' },
        { key: 'japanese', name: '日语' },
        { key: 'korean', name: '韩语' },
        { key: 'french', name: '法语' },
        { key: 'german', name: '德语' },
        { key: 'thai', name: '泰语' },
        { key: 'russian', name: '俄语' }
    ],
    // 年份
    year: [
        { key: 'THIS_YEAR', name: '今年' },
        { key: 'LAST_YEAR', name: '去年' },
        { key: 'EARLIER', name: '更早' },
        { key: 'IN_THE_1990S', name: '90年代' },
        { key: 'IN_THE_1980S', name: '80年代' },
        { key: 'NOSTALGIA', name: '怀旧' }
    ],
    // 排序
    sort: [
        { key: 'default', name: '全部' },
        { key: 'newest', name: '新上映' },
        { key: 'hot', name: '热播榜' },
        { key: 'rating', name: '评分榜' },
        { key: 'new_update', name: '近期更新' }
    ]
};

async function home() {
    return JSON.stringify({
        class: [
            { type_id: '1', type_name: '电影' },
            { type_id: '2', type_name: '电视剧' },
            { type_id: '6', type_name: '韩剧' },
            { type_id: '5', type_name: '短剧' },
            { type_id: '4', type_name: '动画' },
            { type_id: '3', type_name: '综艺' }
        ],
        filters: {
            "1": [
                { key: 'genre', name: '类型', value: FILTER_CONFIG.genre.map(g => ({ n: g.name, v: g.key })) },
                { key: 'region', name: '地区', value: FILTER_CONFIG.region.map(r => ({ n: r.name, v: r.key })) },
                { key: 'language', name: '语言', value: FILTER_CONFIG.language.map(l => ({ n: l.name, v: l.key })) },
                { key: 'year', name: '年份', value: FILTER_CONFIG.year.map(y => ({ n: y.name, v: y.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ],
            "2": [
                { key: 'genre', name: '类型', value: FILTER_CONFIG.genre.map(g => ({ n: g.name, v: g.key })) },
                { key: 'region', name: '地区', value: FILTER_CONFIG.region.map(r => ({ n: r.name, v: r.key })) },
                { key: 'language', name: '语言', value: FILTER_CONFIG.language.map(l => ({ n: l.name, v: l.key })) },
                { key: 'year', name: '年份', value: FILTER_CONFIG.year.map(y => ({ n: y.name, v: y.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ],
            "3": [
                { key: 'genre', name: '类型', value: FILTER_CONFIG.genre.map(g => ({ n: g.name, v: g.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ],
            "4": [
                { key: 'genre', name: '类型', value: FILTER_CONFIG.genre.map(g => ({ n: g.name, v: g.key })) },
                { key: 'region', name: '地区', value: FILTER_CONFIG.region.map(r => ({ n: r.name, v: r.key })) },
                { key: 'year', name: '年份', value: FILTER_CONFIG.year.map(y => ({ n: y.name, v: y.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ],
            "5": [
                { key: 'region', name: '地区', value: FILTER_CONFIG.region.map(r => ({ n: r.name, v: r.key })) },
                { key: 'year', name: '年份', value: FILTER_CONFIG.year.map(y => ({ n: y.name, v: y.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ],
            "6": [
                { key: 'year', name: '年份', value: FILTER_CONFIG.year.map(y => ({ n: y.name, v: y.key })) },
                { key: 'sort', name: '排序', value: FILTER_CONFIG.sort.map(s => ({ n: s.name, v: s.key })) }
            ]
        }
    });
}

async function homeVod() {
    try {
        const res = await request(HOST + '/movie/media/home/custom/classify/1/3?limit=12');
        let list = (res.data.records[0].mediaResources || []).map(it => formatVod(it));
        return JSON.stringify({ list });
    } catch (e) { return JSON.stringify({ list: [] }); }
}

async function category(tid, pg, filter, extend) {
    // 构建 menuCodeList：将 extend 中的筛选条件与它们的类别一起添加
    let menuCodeList = [];
    const filterKeys = ['genre', 'region', 'language', 'year'];
    for (const key of filterKeys) {
        if (extend[key]) {
            menuCodeList.push(extend[key]);
        }
    }
    const payload = {
        "menuCodeList": menuCodeList,
        "pageIndex": parseInt(pg),
        "pageSize": 24,
        "searchKey": "",
        "sortCode": extend.sort || "newest",
        "topCode": typeToSlug(tid),
        "randSort": false
    };
    const res = await request(HOST + '/movie/media/search', 'post', payload);
    return JSON.stringify({
        page: parseInt(pg),
        list: (res.data.records || []).map(it => formatVod(it))
    });
}

async function detail(id) {
    const detailRes = await request(HOST + '/movie/media/base/detail?mediaId=' + id);
    const media = detailRes.data;
    const videoRes = await request(HOST + '/movie/media/video/list?mediaId=' + id + '&lineName=&resolutionCode=');
    const groups = videoRes.data || [];
    
    let playUrls = [];
    if (groups.length > 0 && groups[0].videoList) {
        const vList = groups[0].videoList;
        vList.forEach((item, index) => {
            // 关键修复：电影可能没有 epNo 或 epNo 为 0
            // 如果是单集（电影），name 叫“正片”；如果是多集，叫“第X集”
            let ep = item.epNo || (vList.length === 1 ? 1 : index + 1);
            let name = vList.length === 1 ? "正片" : "第" + ep.toString().padStart(2, '0') + "集";
            playUrls.push(`${name}$${id}--${ep}`);
        });
    }

    const vod = {
        vod_id: id,
        vod_name: media.title,
        vod_pic: normalizePic(media.posterUrlS3 || media.posterUrl),
        vod_remarks: media.episodeStatus || '',
        vod_content: media.overview || '',
        vod_play_from: 'wooyun',
        vod_play_url: playUrls.join('#')
    };
    return JSON.stringify({ list: [vod] });
}

async function play(flag, id, flags) {
    const parts = id.split("--");
    const mediaId = parts[0];
    const epNo = parts[1];

    try {
        const res = await request(HOST + '/movie/media/video/list?mediaId=' + mediaId);
        const groups = res.data || [];
        
        if (groups.length > 0 && groups[0].videoList) {
            const vList = groups[0].videoList;
            // 优化匹配逻辑：如果只有一集（电影），直接取第一集，不判断 epNo
            let pick = vList.length === 1 ? vList[0] : vList.find(v => v.epNo == epNo);
            
            // 如果 find 没找到（可能是电影数据异常），兜底取第一集
            if (!pick) pick = vList[0];

            return JSON.stringify({
                parse: 0,
                url: pick.playUrl,
                header: { 'User-Agent': UA_PC, 'Referer': HOST + '/' }
            });
        }
    } catch (e) {}
    return JSON.stringify({ parse: 0, url: "" });
}

async function search(wd, quick) {
    const payload = { "pageIndex": 1, "pageSize": 20, "searchKey": wd, "topCode": "" };
    const res = await request(HOST + '/movie/media/search', 'post', payload);
    return JSON.stringify({ list: (res.data.records || []).map(it => formatVod(it)) });
}

function formatVod(it) {
    return {
        vod_id: it.id.toString(),
        vod_name: it.title || it.mediaName,
        vod_pic: normalizePic(it.posterUrlS3 || it.posterUrl),
        vod_remarks: it.episodeStatus || it.releaseYear || ""
    };
}

function typeToSlug(tid) {
    const map = { "1": "movie", "2": "tv_series", "3": "variety", "4": "animation", "5": "short_drama", "6": "korean_drama" };
    return map[tid] || "movie";
}

function normalizePic(url) {
    if (!url) return '';
    return url.startsWith('http') ? url : HOST + '/' + url.replace(/^\//, '');
}

export function __jsEvalReturn() {
    return { home, homeVod, category, detail, play, search };
}
