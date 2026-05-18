# 4kvm.tv 爬虫工具包

## 目录结构

```
Js/
├── 4kvm.js                 # 基础爬虫源（用于影视聚合平台）
├── 4kvm_playwright.js      # Playwright浏览器自动化版本
├── 4kvm_config.json        # 配置文件
└── 4kvm_analysis.md        # 详细分析报告

Py/
└── 4kvm_crawler.py         # Python异步爬虫版本
```

## 文件说明

### 1. 4kvm.js - 基础爬虫源

**用途**: 用于影视聚合平台（如cat.js等）的爬虫源文件

**功能**:
- 首页分类
- 视频列表获取
- 视频详情获取
- 播放地址获取
- 搜索功能

**使用方法**:
```javascript
// 集成到cat.js等平台
const spider = require('./4kvm.js');
spider.home();        // 获取首页分类
spider.detail(id);    // 获取视频详情
spider.play(flag, id); // 获取播放地址
```

### 2. 4kvm_playwright.js - Playwright版本

**用途**: 使用Playwright浏览器自动化获取视频

**依赖**:
```bash
npm install playwright
playwright install chromium
```

**使用方法**:
```bash
node 4kvm_playwright.js
```

**功能**:
- 自动打开浏览器
- 获取视频列表
- 获取视频详情和剧集
- 获取M3U8播放地址
- 处理WASM加密内容

### 3. 4kvm_crawler.py - Python版本

**用途**: Python异步爬虫实现

**依赖**:
```bash
pip install requests aiohttp playwright
playwright install chromium
```

**使用方法**:
```bash
python 4kvm_crawler.py
```

**功能**:
- 异步处理
- 浏览器自动化
- API直连（部分可用）
- 完整视频信息获取

### 4. 4kvm_config.json - 配置文件

**用途**: 配置参数和API信息

**内容**:
- 网站基础URL
- 分类信息
- API端点
- 播放器参数
- 加密配置
- 爬虫设置

## 技术分析

### 播放地址生成流程

1. **请求构造**
   ```
   /video/play?p=33752&v={video_id}&q=1080&s={signature}&t={timestamp}&k={encrypted_key}
   ```

2. **参数说明**
   - `p`: 提供商ID（固定33752）
   - `v`: 视频ID（格式：ch + 字母数字）
   - `q`: 视频质量（720/1080/4K）
   - `s`: MD5签名（video_id + timestamp）
   - `t`: 时间戳（毫秒）
   - `k`: Base64加密密钥

3. **WASM解密**
   - 模块：`/static/wasm/nbmovie_wasm.426511b7.js`
   - 函数：`build_play_url(dataid, secret_key, quality, play_key)`
   - 返回：M3U8播放地址

4. **响应格式**
   ```json
   {
     "parse": 0,
     "url": "https://oss.douyinbit.com/m3u8/xxx.m3u8",
     "header": {}
   }
   ```

## 使用建议

### 1. 简单爬取（cat.js平台）

如果只需要基础功能，使用 `4kvm.js`：

```javascript
// 在cat.js中配置
{
  "name": "4kvm",
  "url": "https://www.4kvm.tv",
  "js": "4kvm.js"
}
```

### 2. 完整爬取（需要播放地址）

使用浏览器自动化版本：

```bash
# Node.js版本
npm install playwright
node 4kvm_playwright.js

# 或 Python版本
pip install playwright
playwright install chromium
python 4kvm_crawler.py
```

### 3. 自定义开发

基于 `4kvm_config.json` 中的配置进行开发：

```javascript
const config = require('./4kvm_config.json');

async function getVideoUrl(videoId) {
    const timestamp = Date.now();
    const signature = md5(videoId + timestamp);
    const encryptedKey = encrypt(videoId, timestamp);
    
    const url = `${config.baseUrl}${config.api.videoPlay}?` +
        `${config.player.providerKey}=${config.player.provider}&` +
        `${config.player.videoIdKey}=${videoId}&` +
        `${config.player.qualityKey}=${config.player.defaultQuality}&` +
        `${config.player.signatureKey}=${signature}&` +
        `${config.player.timestampKey}=${timestamp}&` +
        `${config.player.keyParam}=${encryptedKey}`;
    
    return url;
}
```

## 注意事项

### 法律合规
- 仅用于学习和研究
- 遵守网站的robots.txt规则
- 尊重版权和知识产权
- 不要过度频繁请求

### 技术限制
- 播放地址通过WASM加密
- 需要浏览器环境或逆向分析
- 地址具有时效性

### 稳定性
- 添加异常处理
- 实现重试机制
- 控制请求频率
- 使用代理池（可选）

## 更新维护

- 网站结构可能变化
- 定期检查API可用性
- 更新配置文件
- 监控WASM模块变化

## 示例输出

### 视频列表
```json
{
  "list": [
    {
      "vod_id": "ch44vpwk4",
      "vod_name": "飞驰人生3",
      "vod_pic": "https://example.com/cover.jpg",
      "vod_remarks": "7.3"
    }
  ]
}
```

### 视频详情
```json
{
  "list": [{
    "vod_id": "ch44vn3es",
    "vod_name": "飞驰人生3",
    "vod_pic": "https://example.com/cover.jpg",
    "type_name": "电影",
    "vod_year": "2025",
    "vod_area": "大陆",
    "vod_remarks": "7.3",
    "vod_actor": "沈腾,尹正,黄景瑜",
    "vod_director": "韩寒",
    "vod_content": "巴音布鲁克最后一站...",
    "vod_play_from": "4kvm",
    "vod_play_url": "第1集$ch44vpwk4#第2集$ch45z8s92"
  }]
}
```

### 播放地址
```json
{
  "parse": 0,
  "url": "https://oss.douyinbit.com/m3u8/b1d7876b4da38c9b03d5e64d8739a7aa.m3u8",
  "header": {
    "User-Agent": "Mozilla/5.0..."
  }
}
```

## 联系方式

如有问题或建议，请提交Issue或Pull Request。

## 许可证

MIT License
