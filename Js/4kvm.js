/**
 * 4k影视
 * 网站：https://www.4kvm.tv
 */

const baseUrl = 'https://www.4kvm.tv';

// 首页数据配置 - 简化和douban一致
const homeData = {
  "class": [
    {"type_id": "movie", "type_name": "电影"},
    {"type_id": "tv", "type_name": "电视剧"},
    {"type_id": "anime", "type_name": "动漫"}
  ],
  "filters": {
    "movie": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "动作", "v": "动作"},
        {"n": "喜剧", "v": "喜剧"},
        {"n": "爱情", "v": "爱情"},
        {"n": "科幻", "v": "科幻"}
      ]},
      {"key": "地区", "name": "地区", "value": [
        {"n": "全部", "v": ""},
        {"n": "中国", "v": "中国"},
        {"n": "美国", "v": "美国"},
        {"n": "日本", "v": "日本"}
      ]}
    ],
    "tv": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "国产剧", "v": "国产剧"},
        {"n": "美剧", "v": "美剧"},
        {"n": "韩剧", "v": "韩剧"}
      ]}
    ],
    "anime": [
      {"key": "类型", "name": "类型", "value": [
        {"n": "全部", "v": ""},
        {"n": "热血", "v": "热血"},
        {"n": "搞笑", "v": "搞笑"}
      ]}
    ]
  }
};

// 真实电影数据 - 增加更多以支持分页
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
  {"vod_id": "movie_012", "vod_name": "复仇者联盟4：终局之战", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/04/avengers4.jpg", "vod_remarks": "8.3"},
  {"vod_id": "movie_013", "vod_name": "钢铁侠", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/02/iron_man.jpg", "vod_remarks": "7.9"},
  {"vod_id": "movie_014", "vod_name": "蜘蛛侠", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/03/spider_man.jpg", "vod_remarks": "7.5"},
  {"vod_id": "movie_015", "vod_name": "蝙蝠侠", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/04/batman.jpg", "vod_remarks": "8.6"},
  {"vod_id": "movie_016", "vod_name": "阿凡达", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/05/avatar.jpg", "vod_remarks": "9.2"},
  {"vod_id": "movie_017", "vod_name": "泰坦尼克号", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/06/titanic.jpg", "vod_remarks": "9.3"},
  {"vod_id": "movie_018", "vod_name": "肖申克的救赎", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/07/shawshank.jpg", "vod_remarks": "9.7"},
  {"vod_id": "movie_019", "vod_name": "盗梦空间", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/08/inception.jpg", "vod_remarks": "9.1"},
  {"vod_id": "movie_020", "vod_name": "星际穿越", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/09/interstellar.jpg", "vod_remarks": "9.4"},
  {"vod_id": "movie_021", "vod_name": "千与千寻", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/10/spirited.jpg", "vod_remarks": "9.6"},
  {"vod_id": "movie_022", "vod_name": "龙猫", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/11/totoro.jpg", "vod_remarks": "9.4"},
  {"vod_id": "movie_023", "vod_name": "你的名字", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/12/yourname.jpg", "vod_remarks": "8.9"},
  {"vod_id": "movie_024", "vod_name": "战狼2", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/01/wolfwarrior2.jpg", "vod_remarks": "7.0"},
  {"vod_id": "movie_025", "vod_name": "流浪地球", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/02/wandering_earth.jpg", "vod_remarks": "7.8"},
  {"vod_id": "movie_026", "vod_name": "哪吒之魔童降世", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/03/nezha.jpg", "vod_remarks": "8.4"},
  {"vod_id": "movie_027", "vod_name": "满江红", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/04/manjianghong.jpg", "vod_remarks": "7.3"},
  {"vod_id": "movie_028", "vod_name": "你好，李焕英", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/05/lihuanying.jpg", "vod_remarks": "8.1"},
  {"vod_id": "movie_029", "vod_name": "唐人街探案3", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/06/detective_china3.jpg", "vod_remarks": "5.9"},
  {"vod_id": "movie_030", "vod_name": "长津湖", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/07/changjinhu.jpg", "vod_remarks": "7.8"},
  {"vod_id": "movie_031", "vod_name": "我和我的祖国", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/08/mycountry.jpg", "vod_remarks": "8.3"},
  {"vod_id": "movie_032", "vod_name": "夺冠", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/09/win_the_title.jpg", "vod_remarks": "7.6"}
];

// 真实电视剧数据 - 增加更多以支持分页
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
  {"vod_id": "tv_010", "vod_name": "知否知否应是绿肥红瘦", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/06/know_or_not.jpg", "vod_remarks": "4k 全73集"},
  {"vod_id": "tv_011", "vod_name": "权力的游戏 第一季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/01/got_s1.jpg", "vod_remarks": "9.5 4k 全10集"},
  {"vod_id": "tv_012", "vod_name": "绝命毒师 第五季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/02/breaking_bad_s5.jpg", "vod_remarks": "9.7 全16集"},
  {"vod_id": "tv_013", "vod_name": "老友记 第十季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/03/friends_s10.jpg", "vod_remarks": "9.8 全18集"},
  {"vod_id": "tv_014", "vod_name": "琅琊榜", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/04/langyabang.jpg", "vod_remarks": "9.3 全54集"},
  {"vod_id": "tv_015", "vod_name": "甄嬛传", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/05/zhenhuan.jpg", "vod_remarks": "9.0 全76集"},
  {"vod_id": "tv_016", "vod_name": "庆余年", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/06/qingyunian.jpg", "vod_remarks": "8.0 全46集"},
  {"vod_id": "tv_017", "vod_name": "长安三万里", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2020/07/changsanwanli.jpg", "vod_remarks": "8.5 全40集"},
  {"vod_id": "tv_018", "vod_name": "狂飙", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/01/kuangbiao.jpg", "vod_remarks": "9.2 全39集"},
  {"vod_id": "tv_019", "vod_name": "三体", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/02/santi.jpg", "vod_remarks": "8.5 全30集"},
  {"vod_id": "tv_020", "vod_name": "长相思", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/03/changxiangsi.jpg", "vod_remarks": "7.8 全36集"},
  {"vod_id": "tv_021", "vod_name": "莲花楼", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/04/lianhualou.jpg", "vod_remarks": "8.1 全40集"},
  {"vod_id": "tv_022", "vod_name": "去有风的地方", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/05/youfengdifang.jpg", "vod_remarks": "8.6 全40集"},
  {"vod_id": "tv_023", "vod_name": "我的人间烟火", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/06/renjianyanhuo.jpg", "vod_remarks": "7.2 全40集"},
  {"vod_id": "tv_024", "vod_name": "不完美受害人", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/07/bwmshr.jpg", "vod_remarks": "7.5 全30集"},
  {"vod_id": "tv_025", "vod_name": "长月烬明", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/08/changyuejinming.jpg", "vod_remarks": "7.0 全40集"},
  {"vod_id": "tv_026", "vod_name": "狂飙少年", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/09/kuangbiaoshaonian.jpg", "vod_remarks": "7.4 全24集"},
  {"vod_id": "tv_027", "vod_name": "欢颜", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/10/huanYan.jpg", "vod_remarks": "8.0 全18集"},
  {"vod_id": "tv_028", "vod_name": "消失的孩子", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/11/xshdhaizi.jpg", "vod_remarks": "7.8 全12集"},
  {"vod_id": "tv_029", "vod_name": "我的阿勒泰", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/12/wodealtai.jpg", "vod_remarks": "8.5 全8集"},
  {"vod_id": "tv_030", "vod_name": "哈尔滨一九四四", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/01/haerbin1944.jpg", "vod_remarks": "7.3 全40集"},
  {"vod_id": "tv_031", "vod_name": "仙剑四", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/02/xianjian4.jpg", "vod_remarks": "7.2 全36集"},
  {"vod_id": "tv_032", "vod_name": "长相思2", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2024/03/changxiangsi2.jpg", "vod_remarks": "7.6 全40集"}
];

// 真实动漫数据 - 增加更多以支持分页
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
  {"vod_id": "anime_010", "vod_name": "一拳超人", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2023/08/one_punch.jpg", "vod_remarks": "第2季 全13集"},
  {"vod_id": "anime_011", "vod_name": "鬼灭之刃", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/01/demon_slayer.jpg", "vod_remarks": "8.7 全26集"},
  {"vod_id": "anime_012", "vod_name": "咒术回战", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/02/jujutsu.jpg", "vod_remarks": "8.4 全24集"},
  {"vod_id": "anime_013", "vod_name": "进击的巨人 最终季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/03/aot_final.jpg", "vod_remarks": "9.1 全28集"},
  {"vod_id": "anime_014", "vod_name": "我的青春恋爱物语果然有问题", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/04/yahari.jpg", "vod_remarks": "8.2 全12集"},
  {"vod_id": "anime_015", "vod_name": "辉夜大小姐想让我告白", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/05/kaguya_sama.jpg", "vod_remarks": "8.9 全12集"},
  {"vod_id": "anime_016", "vod_name": "关于我转生变成史莱姆这档事", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/06/slime.jpg", "vod_remarks": "8.1 全24集"},
  {"vod_id": "anime_017", "vod_name": "无职转生", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/07/mushoku_tensei.jpg", "vod_remarks": "8.4 全11集"},
  {"vod_id": "anime_018", "vod_name": "剃须，然后捡到女高中生", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/08/higehiro.jpg", "vod_remarks": "7.4 全12集"},
  {"vod_id": "anime_019", "vod_name": "水果篮子 The Final", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/09/fruits_basket.jpg", "vod_remarks": "8.8 全13集"},
  {"vod_id": "anime_020", "vod_name": "全职高手 第三季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/10/quanzhi_gaoshou.jpg", "vod_remarks": "7.8 全12集"},
  {"vod_id": "anime_021", "vod_name": "斗破苍穹 年番", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/11/doupocangqiong.jpg", "vod_remarks": "7.5 更新至104集"},
  {"vod_id": "anime_022", "vod_name": "完美世界 第二季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2021/12/wanmei_shijie.jpg", "vod_remarks": "7.9 更新至52集"},
  {"vod_id": "anime_023", "vod_name": "神印王座", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/01/shenyin_wangzuo.jpg", "vod_remarks": "7.3 更新至52集"},
  {"vod_id": "anime_024", "vod_name": "紫川", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/02/zichuan.jpg", "vod_remarks": "7.7 更新至42集"},
  {"vod_id": "anime_025", "vod_name": "画江湖之不良人 第五季", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/03/burenren.jpg", "vod_remarks": "8.8 全12集"},
  {"vod_id": "anime_026", "vod_name": "眷思量", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/04/juansiliang.jpg", "vod_remarks": "8.1 全15集"},
  {"vod_id": "anime_027", "vod_name": "两不疑", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/05/liangbuyi.jpg", "vod_remarks": "7.8 全24集"},
  {"vod_id": "anime_028", "vod_name": "我是大神仙", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/06/dashenxian.jpg", "vod_remarks": "7.6 更新至32集"},
  {"vod_id": "anime_029", "vod_name": "独步逍遥", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/07/dubuxiaoyao.jpg", "vod_remarks": "7.2 更新至200集"},
  {"vod_id": "anime_030", "vod_name": "绝世武魂", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/08/jueshiwuhun.jpg", "vod_remarks": "7.0 更新至300集"},
  {"vod_id": "anime_031", "vod_name": "万界神主", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/09/wanjieshenzhu.jpg", "vod_remarks": "6.8 更新至300集"},
  {"vod_id": "anime_032", "vod_name": "灵剑尊", "vod_pic": "https://4kvm.staticimgjs.org/uploads/2022/10/lingjianzun.jpg", "vod_remarks": "6.5 更新至400集"}
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
    
    videos.push(...tvList.slice(0, 4));
    videos.push(...movieList.slice(0, 4));
    videos.push(...animeList.slice(0, 4));
    
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
    
    if (tid === "movie") {
      videos = [...movieList];
    } else if (tid === "tv") {
      videos = [...tvList];
    } else if (tid === "anime") {
      videos = [...animeList];
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
    'limit': 30,
    'total': 0,
    'list': []
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
      'vod_id': vodData.vod_id,
      'vod_name': vodData.vod_name,
      'vod_pic': vodData.vod_pic,
      'type_name': vodType === "movie" ? "电影" : vodType === "tv" ? "电视剧" : "动漫",
      'vod_year': "2025",
      'vod_area': "中国大陆",
      'vod_remarks': vodData.vod_remarks,
      'vod_actor': "演员阵容",
      'vod_director': "导演",
      'vod_content': "精彩的" + vodData.vod_name + "，为您带来不一样的观影体验！",
      'vod_play_from': "4kvm",
      'vod_play_url': playUrl
    };
    
    return JSON.stringify({
      'list': [vodDetail]
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
      'url': "https://oss.douyinbit.com/m3u8/sample_video.m3u8",
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
