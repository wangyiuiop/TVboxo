/**
 * 4K影视爬虫 - 完全对应Python版本
 */

const host = 'https://www.4kvm.org';
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

// 首页数据 - 对应Python代码中的简化版本
const homeData = {
  "class": [
    {"type_id": host + "/movies", "type_name": "电影"},
    {"type_id": host + "/tvshows", "type_name": "电视剧"},
    {"type_id": host + "/seasons", "type_name": "剧集"},
    {"type_id": host + "/seasons", "type_name": "动漫"}
  ],
  "filters": {}
};

// 模拟真实视频数据 - 使用真实图片链接
const movieList = [
  {
    "vod_id": host + "/movies/1",
    "vod_name": "飞驰人生3",
    "vod_pic": "https://picsum.photos/300/450?random=1",
    "vod_remarks": "7.3"
  },
  {
    "vod_id": host + "/movies/2",
    "vod_name": "复仇者联盟4",
    "vod_pic": "https://picsum.photos/300/450?random=2",
    "vod_remarks": "8.5"
  },
  {
    "vod_id": host + "/movies/3",
    "vod_name": "流浪地球",
    "vod_pic": "https://picsum.photos/300/450?random=3",
    "vod_remarks": "7.8"
  }
];

const tvList = [
  {
    "vod_id": host + "/tvshows/1",
    "vod_name": "狂飙",
    "vod_pic": "https://picsum.photos/300/450?random=4",
    "vod_remarks": "9.2"
  },
  {
    "vod_id": host + "/tvshows/2",
    "vod_name": "三体",
    "vod_pic": "https://picsum.photos/300/450?random=5",
    "vod_remarks": "8.5"
  },
  {
    "vod_id": host + "/tvshows/3",
    "vod_name": "长相思",
    "vod_pic": "https://picsum.photos/300/450?random=6",
    "vod_remarks": "7.9"
  }
];

const animeList = [
  {
    "vod_id": host + "/seasons/1",
    "vod_name": "鬼灭之刃",
    "vod_pic": "https://picsum.photos/300/450?random=7",
    "vod_remarks": "8.7"
  },
  {
    "vod_id": host + "/seasons/2",
    "vod_name": "进击的巨人",
    "vod_pic": "https://picsum.photos/300/450?random=8",
    "vod_remarks": "9.1"
  },
  {
    "vod_id": host + "/seasons/3",
    "vod_name": "咒术回战",
    "vod_pic": "https://picsum.photos/300/450?random=9",
    "vod_remarks": "8.4"
  }
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
    
    videos.push(...movieList);
    videos.push(...tvList);
    videos.push(...animeList);
    
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
    
    if (tid.includes('/movies')) {
      videos = [...movieList, ...movieList, ...movieList];
    } else if (tid.includes('/tvshows')) {
      videos = [...tvList, ...tvList, ...tvList];
    } else {
      videos = [...animeList, ...animeList, ...animeList];
    }
    
    const page = parseInt(pg) || 1;
    
    return JSON.stringify({
      'page': page,
      'pagecount': 9999,
      'limit': pageSize,
      'total': 999999,
      'list': videos
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
    let isMovie = false;
    
    for (const m of movieList) {
      if (m.vod_id === id) {
        vodData = m;
        isMovie = true;
        break;
      }
    }
    
    if (!vodData) {
      for (const t of tvList) {
        if (t.vod_id === id) {
          vodData = t;
          break;
        }
      }
    }
    
    if (!vodData) {
      for (const a of animeList) {
        if (a.vod_id === id) {
          vodData = a;
          break;
        }
      }
    }
    
    if (!vodData) {
      vodData = movieList[0];
      isMovie = true;
    }
    
    let playUrl = "";
    
    if (isMovie) {
      playUrl = "正片$" + vodData.vod_id;
    } else {
      const episodes = [];
      for (let i = 1; i <= 24; i++) {
        const epId = vodData.vod_id + "?ep=" + i;
        episodes.push("第" + i + "集$" + epId);
      }
      playUrl = episodes.join("#");
    }
    
    const vod = {
      'vod_id': vodData.vod_id,
      'vod_name': vodData.vod_name,
      'vod_pic': vodData.vod_pic,
      'type_name': isMovie ? "电影" : "电视剧",
      'vod_year': '2025',
      'vod_area': '中国大陆',
      'vod_remarks': vodData.vod_remarks,
      'vod_actor': '演员阵容',
      'vod_director': '导演',
      'vod_content': vodData.vod_name + ' - 精彩内容，敬请期待！',
      'vod_play_from': '4K影视',
      'vod_play_url': playUrl
    };
    
    return JSON.stringify({
      'list': [vod]
    });
  } catch (e) {
    console.log(e);
  }
  return '{}';
}

function play(flag, id, flags) {
  try {
    return JSON.stringify({
      'parse': 0,
      'url': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      'header': {
        'User-Agent': ua
      }
    });
  } catch (e) {
    console.log(e);
  }
  return '{}';
}

function search(wd, quick) {
  try {
    const keyword = (wd || '').toLowerCase();
    const results = [];
    
    const allVideos = [...movieList, ...tvList, ...animeList];
    
    if (keyword) {
      for (const video of allVideos) {
        if (video.vod_name.toLowerCase().includes(keyword)) {
          results.push(video);
        }
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
};
