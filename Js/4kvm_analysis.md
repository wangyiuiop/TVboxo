# 4kvm.tv 视频播放地址分析报告

## 一、网站概述
- **网站地址**: https://www.4kvm.tv/
- **网站类型**: 影视视频网站，提供电影、电视剧、动漫等内容
- **技术栈**: Vue.js + Alpine.js + WebAssembly

## 二、视频播放地址生成逻辑分析

### 2.1 播放请求URL结构

从浏览器网络请求中捕获到的播放地址请求：

```
/video/play?p=33752&v=ch44vpwk4&q=1080&s=b507960add28227c987da2ef035d1a18&t=1779110435915&k=NlM7DiACAVFmVWUwJhRGIzcMBk4nNwEJLjwVUA==
```

**参数说明**:
- `p=33752`: 提供商/平台ID（固定值）
- `v=ch44vpwk4`: 视频/剧集ID，格式为 `ch` + 字母数字组合
- `q=1080`: 视频质量（720/1080/4K等）
- `s=b507960add28227c987da2ef035d1a18`: MD5签名，用于验证请求合法性
- `t=1779110435915`: Unix时间戳（毫秒），用于时效性验证
- `k=NlM7DiACAVFmVWUwJhRGIzcMBk4nNwEJLjwVUA==`: Base64编码的加密密钥

### 2.2 加密/解密机制

#### 2.2.1 WebAssembly解密模块

网站使用WebAssembly进行视频地址的动态解密：

**WASM模块位置**: `/static/wasm/nbmovie_wasm.426511b7.js`

**核心解密函数**:
```javascript
build_play_url(dataid, secret_key, quality, play_key)
```

**参数说明**:
- `dataid`: 视频ID（对应URL中的v参数）
- `secret_key`: 密钥（服务端生成）
- `quality`: 视频质量
- `play_key`: 播放密钥

#### 2.2.2 签名生成逻辑

从代码分析，签名生成可能涉及以下步骤：

1. **时间戳`: 当前Unix时间戳（毫秒）
2. **视频ID**: 从URL路径提取
3. **签名算法**: MD5(video_id + timestamp)

#### 2.2.3 密钥加密

`k` 参数的生成可能涉及：
- Base64编码
- AES加密
- 服务器端动态生成

### 2.3 播放响应

成功请求后，返回M3U8播放地址：

```
https://oss.douyinbit.com/m3u8/b1d7876b4da38c9b03d5e64d8739a7aa.m3u8
```

## 三、页面结构分析

### 3.1 视频页面URL格式
- **首页**: `https://www.4kvm.tv/`
- **电影列表**: `https://www.4kvm.tv/movie`
- **电视剧列表**: `https://www.4kvm.tv/tv`
- **动漫列表**: `https://www.4kvm.tv/anime`
- **播放页面**: `https://www.4kvm.tv/play/{video_id}`

### 3.2 视频ID格式
- 电影ID: `ch` + 8位字母数字（如 `ch44vpwk4`）
- 剧集ID: `ch` + 8位字母数字
- 示例: `ch44vpwk4`, `ch34o6w48`, `ch45zoa38`

### 3.3 视频元数据结构

从播放页面提取的数据：
```javascript
{
    vod_id: 'ch44vn3es',
    title: '飞驰人生3',
    cover: 'https://gimg0.baidu.com/...',
    description: '巴音布鲁克最后一站收官后...'
}
```

## 四、API接口分析

### 4.1 已识别的API端点

1. **评分检查**
   - URL: `/api/votes/check?vod_id={vod_id}`
   - 方法: GET
   - 返回: 评分状态

2. **播放量统计**
   - URL: `/api/vod/{vod_id}/hits`
   - 方法: POST
   - 功能: 记录视频播放次数

3. **播放量更新**
   - URL: `/api/vod/{vod_id}/play`
   - 方法: POST
   - 功能: 记录播放

4. **评论接口**
   - URL: `/api/movie/{vod_id}/comments`
   - 参数: `page`, `pagesize`, `order_by`
   - 返回: 评论列表

5. **弹幕接口**
   - URL: `https://4k.dmservce.org/api/v1/danmuku/video/{video_id}`

### 4.2 播放API请求示例

```javascript
GET /video/play?p=33752&v={video_id}&q=1080&s={signature}&t={timestamp}&k={encrypted_key}
Headers:
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
  Referer: https://www.4kvm.tv/play/{video_id}
  Accept: */*
```

## 五、反爬虫机制分析

### 5.1 已识别的防护措施

1. **WASM加密**
   - 视频地址通过WebAssembly模块动态生成
   - 无法直接获取解密算法

2. **签名验证**
   - 请求包含时间戳和签名
   - 签名具有时效性

3. **Referer检查**
   - 要求正确的Referer头

4. **User-Agent验证**
   - 需要模拟真实浏览器

### 5.2 绕过方案

1. **浏览器环境**
   - 在浏览器中执行JavaScript代码
   - 调用WASM模块生成播放地址

2. **Selenium/Playwright**
   - 使用无头浏览器自动化
   - 模拟用户操作获取真实请求

3. **代理池**
   - 使用多个IP地址
   - 避免IP被封禁

## 六、爬虫实现建议

### 6.1 推荐方案

**使用浏览器自动化工具**:
- Playwright 或 Selenium
- 优点: 可以完整执行JavaScript和WASM
- 缺点: 速度较慢，资源消耗大

### 6.2 实现步骤

1. **初始化浏览器**
   - 启动Chrome/Firefox
   - 设置User-Agent和窗口大小

2. **访问视频页面**
   - 导航到播放页面
   - 等待页面完全加载

3. **拦截网络请求**
   - 监听视频相关请求
   - 捕获播放地址

4. **提取M3U8**
   - 从请求中提取M3U8 URL
   - 验证URL有效性

5. **处理剧集列表**
   - 获取所有剧集信息
   - 循环获取每个剧集的播放地址

## 七、数据结构定义

### 7.1 视频信息
```json
{
  "vod_id": "ch44vn3es",
  "vod_name": "飞驰人生3",
  "vod_pic": "https://example.com/cover.jpg",
  "type_name": "电影",
  "vod_year": "2025",
  "vod_area": "大陆",
  "vod_remarks": "7.3",
  "vod_actor": "沈腾,尹正,黄景瑜",
  "vod_director": "韩寒",
  "vod_content": "巴音布鲁克最后一站..."
}
```

### 7.2 播放列表
```json
{
  "vod_play_from": "4kvm",
  "vod_play_url": "第1集$ch44vpwk4#第2集$ch45z8s92..."
}
```

### 7.3 播放响应
```json
{
  "parse": 0,
  "url": "https://oss.douyinbit.com/m3u8/xxx.m3u8",
  "header": {
    "User-Agent": "Mozilla/5.0..."
  }
}
```

## 八、注意事项

1. **法律合规**
   - 仅用于学习和研究
   - 遵守网站robots.txt规则
   - 尊重版权和知识产权

2. **性能考虑**
   - 控制请求频率
   - 使用缓存机制
   - 合理使用代理

3. **稳定性**
   - 添加异常处理
   - 实现重试机制
   - 日志记录

4. **更新维护**
   - 网站结构可能变化
   - 定期检查和更新
   - 监控API可用性

## 九、总结

4kvm.tv 使用了以下技术来保护视频地址：
- WebAssembly动态解密
- 时间戳+签名验证
- Referer检查
- 加密的播放密钥

要成功爬取视频，需要使用浏览器自动化工具或分析WASM模块来模拟解密过程。建议使用Playwright或Selenium来实现完整的爬虫功能。
