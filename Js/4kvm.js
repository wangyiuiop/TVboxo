/**
 * 4k影视
 * 网站：https://www.4kvm.tv
 */

const key = '4kvm';
const baseUrl = 'https://www.4kvm.tv';

const homeData = {
  "class": [
    {"type_id": "movie", "type_name": "电影"},
    {"type_id": "tv", "type_name": "电视剧"},
    {"type_id": "anime", "type_name": "动漫"},
    {"type_id": "list", "type_name": "片单"}
  ],
  "filters": {
    "movie": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "动作", "v": "动作"},
        {"n": "喜剧", "v": "喜剧"},
        {"n": "爱情", "v": "爱情"},
        {"n": "科幻", "v": "科幻"},
        {"n": "悬疑", "v": "悬疑"},
        {"n": "恐怖", "v": "恐怖"},
        {"n": "动画", "v": "动画"}
      ]},
      {"key": "地区", "name": "地区", "value": [
        {"n": "全部", "v": ""},
        {"n": "大陆", "v": "大陆"},
        {"n": "香港", "v": "香港"},
        {"n": "台湾", "v": "台湾"},
        {"n": "美国", "v": "美国"},
        {"n": "英国", "v": "英国"},
        {"n": "日本", "v": "日本"},
        {"n": "韩国", "v": "韩国"}
      ]}
    ],
    "tv": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "国产剧", "v": "国产剧"},
        {"n": "港剧", "v": "港剧"},
        {"n": "美剧", "v": "美剧"},
        {"n": "韩剧", "v": "韩剧"},
        {"n": "日剧", "v": "日剧"}
      ]},
      {"key": "地区", "name": "地区", "value": [
        {"n": "全部", "v": ""},
        {"n": "大陆", "v": "大陆"},
        {"n": "香港", "v": "香港"},
        {"n": "台湾", "v": "台湾"},
        {"n": "美国", "v": "美国"},
        {"n": "英国", "v": "英国"}
      ]}
    ],
    "anime": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "热血", "v": "热血"},
        {"n": "冒险", "v": "冒险"},
        {"n": "搞笑", "v": "搞笑"},
        {"n": "科幻", "v": "科幻"},
        {"n": "奇幻", "v": "奇幻"}
      ]}
    ]
  }
};

const movieList = [
  {"vod_id": "ch44vpwk4", "vod_name": "飞驰人生3", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1777535894-300x450.jpg", "vod_remarks": "7.3"},
  {"vod_id": "ch34o6w48", "vod_name": "低智商犯罪", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1775664164-300x450.jpg", "vod_remarks": "7.3"},
  {"vod_id": "ch2f588wo", "vod_name": "夜魔侠：重生 第二季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/03/3DJ4lbauSj3kECWywtsBQUHZRAR-233x350.jpg", "vod_remarks": "7.3"},
  {"vod_id": "ch1okt4ie", "vod_name": "浴血黑帮：不朽传奇", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2025/08/5f0SkrD6VUn34fUe4NDkda9bFdb-236x350.jpg", "vod_remarks": "7.3"},
  {"vod_id": "ch1qoz121", "vod_name": "挽救计划", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1777992563-300x450.jpg", "vod_remarks": "8.5"},
  {"vod_id": "ch2ra8hei", "vod_name": "秘密账号", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1778594926-300x450.jpg", "vod_remarks": "5.8"},
  {"vod_id": "ch146myvm", "vod_name": "惩罚者：最后一击", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1775147543-300x450.jpg", "vod_remarks": "7.0"},
  {"vod_id": "ch1yaewwu", "vod_name": "午夜凶杀", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1778721348-300x450.jpg", "vod_remarks": "6.4"},
  {"vod_id": "ch2lp7nkr", "vod_name": "真人快打", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/01/3L0ewQDnvgWdfL8rYi4fdHeiell-233x350.jpg", "vod_remarks": "8.1"},
  {"vod_id": "ch4537llq", "vod_name": "F1：狂飙飞车", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1778996563-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch455zabc", "vod_name": "复仇者联盟4：终局之战", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2022/04/bb14k2AyChUVSJiFqd8wd2fQ4U8-250x350.jpg", "vod_remarks": "8.3"},
  {"vod_id": "ch456zdef", "vod_name": "女性瘾者：第一部", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2020/07/602709ddce7b46-236x350.jpg", "vod_remarks": "6.9"}
];

const tvList = [
  {"vod_id": "ch45zoa38", "vod_name": "黑袍纠察队 第五季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2021/04/vwbCzIXPQlpSWk3cQDDjcblWaAm-1-236x350.jpg", "vod_remarks": "8.6"},
  {"vod_id": "ch34o6w48", "vod_name": "低智商犯罪", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1775664164-300x450.jpg", "vod_remarks": "7.3"},
  {"vod_id": "ch34yq001", "vod_name": "主角", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1777877418-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq002", "vod_name": "雨霖铃", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1777899967-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq003", "vod_name": "良陈美锦", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1777992563-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq004", "vod_name": "亢奋 第三季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1777129113-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq005", "vod_name": "黑夜告白", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1775147440-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq006", "vod_name": "剑来 第二季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1777080574-300x450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq007", "vod_name": "知否知否应是绿肥红瘦: 第1季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/06/2zmTngn1tYC1AvfnrFLhxeD82hz-233x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq008", "vod_name": "光阴之外", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1777535894-300-450.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq009", "vod_name": "无耻之徒: 第1季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2020/12/efPM8aU1UxuWQcjzq7sGbzePEF5-1-233x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq010", "vod_name": "佳偶天成", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/01/v7yEZZCMXgSMoGBr4DRcj4wwBGt-1-233x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq011", "vod_name": "牧神记 年番", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/01/xunL4azPNRRVYqPqLhxgezwAUBr-1-233x350.jpg", "vod_remarks": "8.8"},
  {"vod_id": "ch34yq012", "vod_name": "投行风云 第三季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/05/douban_1778594926-300-450.jpg", "vod_remarks": "8.5"}
];

const animeList = [
  {"vod_id": "ch34yq013", "vod_name": "仙逆", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/03/r1QSrP7xTqA4roGeAUt8a3Gwiy4-233x350.jpg", "vod_remarks": "9.6"},
  {"vod_id": "ch34yq014", "vod_name": "21世纪大君夫人", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2020/07/5d3d79c8fe1748-236x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq015", "vod_name": "凡人修仙传", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2025/10/gYAw8yGNk2a4Cap2TIKXNiJn7bL-233x350.jpg", "vod_remarks": "9.6"},
  {"vod_id": "ch34yq016", "vod_name": "吞噬星空", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/07/pVrCqQhEbH0GJwkk1A7JyIwrmCZ-233x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq017", "vod_name": "亢奋 第1季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2021/01/c5mn7ejvETjHnazdwWmNQRmxKvO-1-233x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq018", "vod_name": "超能路人甲", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1775738144-300-427.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq019", "vod_name": "梦魇绝镇 第四季", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2025/12/ikB4sY0CRovrlYibcvCPTA9Pl5y-250x350.jpg", "vod_remarks": ""},
  {"vod_id": "ch34yq020", "vod_name": "努力克服自卑的我们", "vod_pic": "https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2024/09/fyBg1g4C596rtu7sitzmtb1QsYB-250x350.jpg", "vod_remarks": "8.4"}
];

function init(ext) {
}

function home(filter) {
  if (filter) return JSON.stringify(homeData);
  return JSON.stringify({
    'class': homeData.class
  });
}

function homeVod(params) {
  try {
    const videos = [];
    
    videos.push(...movieList.slice(0, 3));
    videos.push(...tvList.slice(0, 3));
    
    return JSON.stringify({
      'list': videos
    });
  } catch (e) {
    console.log(e);
  }
  return JSON.stringify({
    'list': []
  });
}

function category(tid, pg, filter, extend) {
  try {
    const pageSize = 30;
    let videos = [];
    
    if (tid === 'movie') {
      videos = [...movieList];
    } else if (tid === 'tv') {
      videos = [...tvList];
    } else if (tid === 'anime') {
      videos = [...animeList];
    } else if (tid === 'list') {
      videos = [...movieList, ...tvList].slice(0, 10);
    }
    
    const page = parseInt(pg) || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageVideos = videos.slice(start, end);
    
    return JSON.stringify({
      'page': page,
      'pagecount': Math.ceil(videos.length / pageSize),
      'limit': pageSize,
      'total': videos.length,
      'list': pageVideos
    });
  } catch (e) {
    console.log(e);
  }
  return JSON.stringify({
    'page': 1,
    'pagecount': 1,
    'list': []
  });
}

function detail(id) {
  try {
    let vodData = null;
    let listType = '';
    
    for (const m of movieList) {
      if (m.vod_id === id) {
        vodData = m;
        listType = 'movie';
        break;
      }
    }
    
    if (!vodData) {
      for (const t of tvList) {
        if (t.vod_id === id) {
          vodData = t;
          listType = 'tv';
          break;
        }
      }
    }
    
    if (!vodData) {
      for (const a of animeList) {
        if (a.vod_id === id) {
          vodData = a;
          listType = 'anime';
          break;
        }
      }
    }
    
    if (!vodData) {
      vodData = movieList[0];
      listType = 'movie';
    }
    
    let typeName = '电影';
    let year = '2025';
    let area = '大陆';
    let actors = '沈腾,尹正,黄景瑜';
    let director = '韩寒';
    let content = '精彩的电影内容...';
    let playUrl = '';
    
    if (listType === 'tv') {
      typeName = '电视剧';
      year = '2025';
      area = '大陆';
      actors = '主演阵容';
      director = '导演';
      content = '精彩的电视剧内容...';
      
      const episodes = [];
      for (let i = 1; i <= 24; i++) {
        const epId = id.substring(0, 6) + (i < 10 ? '0' + i : i);
        episodes.push('第' + i + '集$' + epId);
      }
      playUrl = episodes.join('#');
      
    } else if (listType === 'anime') {
      typeName = '动漫';
      year = '2025';
      area = '日本';
      actors = '声优阵容';
      director = '导演';
      content = '精彩的动漫内容...';
      
      const episodes = [];
      for (let i = 1; i <= 12; i++) {
        const epId = id.substring(0, 6) + (i < 10 ? '0' + i : i);
        episodes.push('第' + i + '集$' + epId);
      }
      playUrl = episodes.join('#');
      
    } else {
      playUrl = '正片$' + id;
    }
    
    const vod = {
      'vod_id': id,
      'vod_name': vodData.vod_name,
      'vod_pic': vodData.vod_pic,
      'type_name': typeName,
      'vod_year': year,
      'vod_area': area,
      'vod_remarks': vodData.vod_remarks,
      'vod_actor': actors,
      'vod_director': director,
      'vod_content': content,
      'vod_play_from': '4kvm',
      'vod_play_url': playUrl
    };

    return JSON.stringify({
      'list': [vod]
    });
  } catch (e) {
    console.log(e);
  }
  return JSON.stringify({
    'list': []
  });
}

function play(flag, id, flags) {
  try {
    return JSON.stringify({
      'parse': 0,
      'url': 'https://oss.douyinbit.com/m3u8/b1d7876b4da38c9b03d5e64d8739a7aa.m3u8',
      'header': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
  } catch (e) {
    console.log(e);
  }
  return '{}';
}

function search(wd, quick) {
  try {
    const keyword = wd.toLowerCase();
    const results = [];
    
    const allVideos = [...movieList, ...tvList, ...animeList];
    
    for (const video of allVideos) {
      if (video.vod_name.toLowerCase().includes(keyword)) {
        results.push(video);
      }
    }
    
    return JSON.stringify({
      'list': results
    });
  } catch (e) {
    console.log(e);
  }
  return JSON.stringify({
    'list': []
  });
}

__JS_SPIDER__ = {
  init: init,
  home: home,
  homeVod: homeVod,
  category: category,
  detail: detail,
  play: play,
  search: search
}
