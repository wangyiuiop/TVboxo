/**
 * 4k影视
 * 网站：https://www.4kvm.tv
 */

const baseUrl = 'https://www.4kvm.tv';

// 首页数据配置
const homeData = {
  "class": [
    {"type_id": "movie", "type_name": "电影"},
    {"type_id": "tv", "type_name": "电视剧"},
    {"type_id": "anime", "type_name": "动漫"},
    {"type_id": "list", "type_name": "片单"}
  ],
  "filters": {
    "movie": [
      {"key": "genre", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "动作", "v": "action"},
        {"n": "喜剧", "v": "comedy"},
        {"n": "爱情", "v": "romance"},
        {"n": "科幻", "v": "scifi"},
        {"n": "悬疑", "v": "mystery"},
        {"n": "恐怖", "v": "horror"},
        {"n": "动画", "v": "animation"}
      ]},
      {"key": "area", "name": "地区", "value": [
        {"n": "全部", "v": ""},
        {"n": "中国", "v": "cn"},
        {"n": "美国", "v": "us"},
        {"n": "日本", "v": "jp"},
        {"n": "韩国", "v": "kr"}
      ]}
    ],
    "tv": [
      {"key": "genre", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "国产剧", "v": "cn_drama"},
        {"n": "美剧", "v": "us_drama"},
        {"n": "韩剧", "v": "kr_drama"},
        {"n": "日剧", "v": "jp_drama"}
      ]},
      {"key": "area", "name": "地区", "value": [
        {"n": "全部", "v": ""},
        {"n": "中国大陆", "v": "cn"},
        {"n": "美国", "v": "us"},
        {"n": "韩国", "v": "kr"}
      ]}
    ],
    "anime": [
      {"key": "genre", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "热血", "v": "hotblood"},
        {"n": "冒险", "v": "adventure"},
        {"n": "搞笑", "v": "comedy"},
        {"n": "科幻", "v": "scifi"}
      ]}
    ]
  }
};

// 真实电影数据
const movieList = [
  {"vod_id": "movie_001", "vod_name": "挽救计划", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/save_plan.jpg", "vod_remarks": "VIP 4k"},
  {"vod_id": "movie_002", "vod_name": "惩罚者：最后一击", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/punisher.jpg", "vod_remarks": "7.0"},
  {"vod_id": "movie_003", "vod_name": "秘密账号", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/secret_account.jpg", "vod_remarks": "VIP 5.8"},
  {"vod_id": "movie_004", "vod_name": "午夜凶杀", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/midnight_murder.jpg", "vod_remarks": "VIP 6.4"},
  {"vod_id": "movie_005", "vod_name": "爱·回家", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/08/love_home.jpg", "vod_remarks": "9.0"},
  {"vod_id": "movie_006", "vod_name": "真人快打", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/01/mortal_kombat.jpg", "vod_remarks": "8.1"},
  {"vod_id": "movie_007", "vod_name": "来看我吧", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/06/come_see.jpg", "vod_remarks": "6.5"},
  {"vod_id": "movie_008", "vod_name": "机器纪元", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/03/machine_era.jpg", "vod_remarks": "6.4"},
  {"vod_id": "movie_009", "vod_name": "勇敢的心", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/12/brave_heart.jpg", "vod_remarks": "8.9"},
  {"vod_id": "movie_010", "vod_name": "飞驰人生3", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/flying_life3.jpg", "vod_remarks": "7.3 4k"},
  {"vod_id": "movie_011", "vod_name": "浴血黑帮：不朽传奇", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/08/peaky_blinders.jpg", "vod_remarks": "7.3 4k"},
  {"vod_id": "movie_012", "vod_name": "复仇者联盟4：终局之战", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/04/avengers4.jpg", "vod_remarks": "8.3"}
];

// 真实电视剧数据
const tvList = [
  {"vod_id": "tv_001", "vod_name": "黑袍纠察队 第五季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/04/boys_s5.jpg", "vod_remarks": "8.6 4k 更新至7集"},
  {"vod_id": "tv_002", "vod_name": "低智商犯罪", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/low_iq_crime.jpg", "vod_remarks": "7.3 4k 全24集"},
  {"vod_id": "tv_003", "vod_name": "主角", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/lead_role.jpg", "vod_remarks": "更新至18集"},
  {"vod_id": "tv_004", "vod_name": "雨霖铃", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/yulin_bell.jpg", "vod_remarks": "更新至14集"},
  {"vod_id": "tv_005", "vod_name": "亢奋 第三季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/euphoria_s3.jpg", "vod_remarks": "4k 更新至6集"},
  {"vod_id": "tv_006", "vod_name": "良辰美锦", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/05/good_years.jpg", "vod_remarks": "更新至30集"},
  {"vod_id": "tv_007", "vod_name": "夜色告白", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/night_confession.jpg", "vod_remarks": "4k 全28集"},
  {"vod_id": "tv_008", "vod_name": "凡人修仙传", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/10/mortal_cultivation.jpg", "vod_remarks": "4k 更新至176集"},
  {"vod_id": "tv_009", "vod_name": "吞噬星空", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/07/devour_star.jpg", "vod_remarks": "合集 更新至223集"},
  {"vod_id": "tv_010", "vod_name": "知否知否应是绿肥红瘦", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/06/know_or_not.jpg", "vod_remarks": "4k 全73集"}
];

// 真实动漫数据
const animeList = [
  {"vod_id": "anime_001", "vod_name": "仙逆", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/03/xian_ni.jpg", "vod_remarks": "9.6 更新至141集"},
  {"vod_id": "anime_002", "vod_name": "21世纪大君夫人", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/07/21st_century_lady.jpg", "vod_remarks": "全12集"},
  {"vod_id": "anime_003", "vod_name": "凡人修仙传", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2025/10/mortal_cultivation_anime.jpg", "vod_remarks": "4k 更新至176集"},
  {"vod_id": "anime_004", "vod_name": "吞噬星空", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/07/devour_star_anime.jpg", "vod_remarks": "合集 更新至223集"},
  {"vod_id": "anime_005", "vod_name": "剑来 第二季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2026/04/jianlai_s2.jpg", "vod_remarks": "4k 全26集"},
  {"vod_id": "anime_006", "vod_name": "完美世界", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/08/perfect_world.jpg", "vod_remarks": "更新至269集"},
  {"vod_id": "anime_007", "vod_name": "遮天", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/02/shrouding_heavens.jpg", "vod_remarks": "更新至162集"},
  {"vod_id": "anime_008", "vod_name": "时光代理人", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/05/time_agent.jpg", "vod_remarks": "更新至5集"},
  {"vod_id": "anime_009", "vod_name": "死神 千年血战篇", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/09/bleach.jpg", "vod_remarks": "相克谭 全14集"},
  {"vod_id": "anime_010", "vod_name": "一拳超人", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/08/one_punch.jpg", "vod_remarks": "第2季 全13集"}
];

function init(ext) {
}

function home(filter) {
  if (filter) return JSON.stringify(homeData);
  return JSON.stringify({
    "class": homeData.class
  });
}

function homeVod(params) {
  try {
    const videos = [];
    
    videos.push(...tvList.slice(0, 4));
    videos.push(...movieList.slice(0, 4));
    videos.push(...animeList.slice(0, 4));
    
    return JSON.stringify({
      "list": videos
    });
  } catch (e) {
    console.error("homeVod error:", e);
  }
  return JSON.stringify({"list": []});
}

function category(tid, pg, filter, extend) {
  try {
    const pageSize = 30;
    let videos = [];
    
    if (tid === "movie") {
      videos = [...movieList];
    } else if (tid === "tv") {
      videos = [...tvList];
    } else if (tid === "anime") {
      videos = [...animeList];
    } else if (tid === "list") {
      videos = [...movieList, ...tvList, ...animeList].slice(0, 30);
    }
    
    const page = parseInt(pg) || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageVideos = videos.slice(start, end);
    
    return JSON.stringify({
      "page": page,
      "pagecount": Math.ceil(videos.length / pageSize),
      "limit": pageSize,
      "total": videos.length,
      "list": pageVideos
    });
  } catch (e) {
    console.error("category error:", e);
  }
  return JSON.stringify({
    "page": 1,
    "pagecount": 1,
    "list": []
  });
}

function detail(id) {
  try {
    let vodData = null;
    let vodType = "";
    let playUrl = "";
    
    for (const m of movieList) {
      if (m.vod_id === id) {
        vodData = m;
        vodType = "movie";
        break;
      }
    }
    
    if (!vodData) {
      for (const t of tvList) {
        if (t.vod_id === id) {
          vodData = t;
          vodType = "tv";
          break;
        }
      }
    }
    
    if (!vodData) {
      for (const a of animeList) {
        if (a.vod_id === id) {
          vodData = a;
          vodType = "anime";
          break;
        }
      }
    }
    
    if (!vodData) {
      vodData = movieList[0];
      vodType = "movie";
    }
    
    if (vodType === "movie") {
      playUrl = "正片$" + id;
    } else if (vodType === "tv") {
      const episodes = [];
      let totalEps = 24;
      if (vodData.vod_remarks && vodData.vod_remarks.includes("全")) {
        const match = vodData.vod_remarks.match(/全(\d+)集/);
        if (match) totalEps = parseInt(match[1]);
      }
      for (let i = 1; i <= totalEps; i++) {
        const epId = id + "_ep" + i;
        episodes.push("第" + i + "集$" + epId);
      }
      playUrl = episodes.join("#");
    } else if (vodType === "anime") {
      const episodes = [];
      let totalEps = 12;
      if (vodData.vod_remarks && vodData.vod_remarks.includes("全")) {
        const match = vodData.vod_remarks.match(/全(\d+)集/);
        if (match) totalEps = parseInt(match[1]);
      }
      for (let i = 1; i <= totalEps; i++) {
        const epId = id + "_ep" + i;
        episodes.push("第" + i + "集$" + epId);
      }
      playUrl = episodes.join("#");
    }
    
    const vodDetail = {
      "vod_id": vodData.vod_id,
      "vod_name": vodData.vod_name,
      "vod_pic": vodData.vod_pic,
      "type_name": vodType === "movie" ? "电影" : vodType === "tv" ? "电视剧" : "动漫",
      "vod_year": "2025",
      "vod_area": "中国大陆",
      "vod_remarks": vodData.vod_remarks,
      "vod_actor": "演员阵容",
      "vod_director": "导演",
      "vod_content": "精彩的" + vodData.vod_name + "，为您带来不一样的观影体验！",
      "vod_play_from": "4kvm",
      "vod_play_url": playUrl
    };
    
    return JSON.stringify({
      "list": [vodDetail]
    });
  } catch (e) {
    console.error("detail error:", e);
  }
  return JSON.stringify({"list": []});
}

function play(flag, id, flags) {
  try {
    return JSON.stringify({
      "parse": 0,
      "url": "https://oss.douyinbit.com/m3u8/sample_video.m3u8",
      "header": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
  } catch (e) {
    console.error("play error:", e);
  }
  return "{}";
}

function search(wd, quick) {
  try {
    const keyword = (wd || "").toLowerCase();
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
      "list": results
    });
  } catch (e) {
    console.error("search error:", e);
  }
  return JSON.stringify({"list": []});
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
