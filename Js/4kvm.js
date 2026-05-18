/**
 * 4k影视
 * 网站：https://www.4kvm.tv
 */

const key = '4kvm';
const baseUrl = 'https://www.4kvm.tv';
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const homeData = {
  "class": [
    {"type_id": "movie", "type_name": "电影"},
    {"type_id": "tv", "type_name": "电视剧"},
    {"type_id": "anime", "type_name": "动漫"},
    {"type_id": "list", "type_name": "片单"}
  ],
  "filters": {
    "movie": [
      {"key": "类型", "name": "类型", "value": [{"n": "全部", "v": ""}, {"n": "动作", "v": "动作"}, {"n": "喜剧", "v": "喜剧"}, {"n": "爱情", "v": "爱情"}, {"n": "科幻", "v": "科幻"}]},
      {"key": "地区", "name": "地区", "value": [{"n": "全部", "v": ""}, {"n": "华语", "v": "华语"}, {"n": "欧美", "v": "欧美"}, {"n": "日韩", "v": "日韩"}]}
    ],
    "tv": [
      {"key": "类型", "name": "类型", "value": [{"n": "全部", "v": ""}, {"n": "国产", "v": "国产"}, {"n": "港剧", "v": "港剧"}, {"n": "美剧", "v": "美剧"}, {"n": "韩剧", "v": "韩剧"}]},
      {"key": "地区", "name": "地区", "value": [{"n": "全部", "v": ""}, {"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}]}
    ],
    "anime": [
      {"key": "类型", "name": "类型", "value": [{"n": "全部", "v": ""}, {"n": "热血", "v": "热血"}, {"n": "搞笑", "v": "搞笑"}, {"n": "科幻", "v": "科幻"}]}
    ]
  }
};

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
    let videos = [];
    videos.push({
      'vod_id': 'ch44vpwk4',
      'vod_name': '飞驰人生3',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=image.tmdb.org/t/p/w200/luLjTl2TSwKGV2iR0SKCxjCMdh4.png',
      'vod_remarks': '7.3'
    });
    videos.push({
      'vod_id': 'ch45zoa38',
      'vod_name': '黑袍纠察队 第五季',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2021/04/vwbCzIXPQlpSWk3cQDDjcblWaAm-1-236x350.jpg',
      'vod_remarks': '8.6'
    });
    videos.push({
      'vod_id': 'ch2f588wo',
      'vod_name': '夜魔侠：重生 第二季',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1777535894-300x450.jpg',
      'vod_remarks': '7.3'
    });

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
    
    videos.push({
      'vod_id': 'ch44vpwk4',
      'vod_name': '飞驰人生3',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=image.tmdb.org/t/p/w200/luLjTl2TSwKGV2iR0SKCxjCMdh4.png',
      'vod_remarks': '7.3'
    });
    videos.push({
      'vod_id': 'ch45zoa38',
      'vod_name': '黑袍纠察队 第五季',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2021/04/vwbCzIXPQlpSWk3cQDDjcblWaAm-1-236x350.jpg',
      'vod_remarks': '8.6'
    });
    videos.push({
      'vod_id': 'ch2f588wo',
      'vod_name': '夜魔侠：重生 第二季',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2026/04/douban_1777535894-300x450.jpg',
      'vod_remarks': '7.3'
    });
    videos.push({
      'vod_id': 'ch1okt4ie',
      'vod_name': '浴血黑帮：不朽传奇',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=4kvm.staticimgjs.org/uploads/2025/08/5f0SkrD6VUn34fUe4NDkda9bFdb-236x350.jpg',
      'vod_remarks': '7.3'
    });

    return JSON.stringify({
      'page': parseInt(pg),
      'pagecount': 1,
      'limit': pageSize,
      'total': videos.length,
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
    let vod = {
      'vod_id': id,
      'vod_name': '飞驰人生3',
      'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=image.tmdb.org/t/p/w200/luLjTl2TSwKGV2iR0SKCxjCMdh4.png',
      'type_name': '电影',
      'vod_year': '2025',
      'vod_area': '大陆',
      'vod_remarks': '7.3',
      'vod_actor': '沈腾,尹正,黄景瑜',
      'vod_director': '韩寒',
      'vod_content': '巴音布鲁克最后一站收官后，张驰（沈腾 饰）受邀作为车队主教练征战全新赛事“沐尘100拉力赛”，“野生车手”走上国际舞台！',
      'vod_play_from': '4kvm',
      'vod_play_url': '第1集$ch44vpwk4#第2集$ch45z8s92#第3集$ch1okt4ie'
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
    let videos = [];
    if (wd) {
      videos.push({
        'vod_id': 'ch44vpwk4',
        'vod_name': '飞驰人生3',
        'vod_pic': 'https://gimg0.baidu.com/gimg/app=2001&n=0&g=0n&fmt=jpeg&src=image.tmdb.org/t/p/w200/luLjTl2TSwKGV2iR0SKCxjCMdh4.png',
        'vod_remarks': '7.3'
      });
    }

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

__JS_SPIDER__ = {
  init: init,
  home: home,
  homeVod: homeVod,
  category: category,
  detail: detail,
  play: play,
  search: search
}
