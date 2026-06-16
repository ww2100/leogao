# 杉越纺织 · 企业官网

**网址：** https://www.yarnsvc.com  
**仓库：** GitHub — `ww2100/leogao`  
**托管：** GitHub Pages  
**技术栈：** 纯 HTML + Vanilla CSS + 少量 JavaScript（无框架依赖）

---

## 目录结构

```
公司网站/
├── index.html              # 首页
├── about us.html           # 关于我们
├── knit.html               # 针织面料
├── spun-yarn.html          # 纺纱
├── filament-yarn.html      # 长丝纱
├── dope-dyed-yarn.html     # 原液着色纱
├── functional-yarn.html    # 功能性纱线
├── cooling-yarn.html       # 凉感纱
├── fibers.html             # 纤维
├── fdy-workshop.html       # 工厂参观页
├── news.html               # 新闻列表
├── news/                   # 新闻详情文章（每篇一个 HTML 文件）
├── images/                 # 所有图片资源
│   ├── favicon.ico         # 网站图标（纱轴，蓝金配色）
│   ├── favicon-96x96.png   # Chrome/Firefox 高清图标
│   ├── apple-touch-icon.png # iPhone 添加到主屏图标
│   ├── hero1.webp / hero3.webp / 3.webp  # 首页轮播图
│   ├── 1617260470109543.webp              # 工厂展示：天轨系统
│   ├── spinning-extrusion.webp           # 工厂展示：纺丝生产线
│   └── ...（其他产品/工厂图片）
├── styles/
│   ├── main.css            # 首页主样式（已去注释压缩）
│   ├── common.css          # 子页面公共样式（导航、页脚等）
│   └── product.css         # 产品页专用样式（卡片、表格等）
├── scripts/
│   └── main.js             # 轮播图 JS（Hero + 工厂展示轮播）
├── backup/                 # 历史版本备份
├── deploy.sh               # 一键发布脚本（终端使用）
├── .github/
│   └── workflows/
│       └── cloudflare-purge.yml  # 自动清除 Cloudflare CDN 缓存
└── README.md               # 本文档
```

---

## 日常更新流程

### 方式一：GitHub Desktop（推荐）

1. 在 Finder 或 VS Code 中修改对应 HTML / 图片文件
2. 打开 **GitHub Desktop**
3. 左侧查看已改动的文件，填写 **Summary（提交说明）**
4. 点击 **Commit to master**
5. 点击 **Push origin**
6. **等待约 1~3 分钟**，GitHub Pages 自动部署，网站更新上线
7. 如果已配置 Cloudflare（见下方），缓存也会**自动清除**

### 方式二：终端一键发布

```bash
cd /Users/gaofei/公司文件/公司网站
bash deploy.sh
```

---

## 更换/添加图片的注意事项

| 操作 | 建议 |
|------|------|
| 替换已有图片（同文件名） | ⚠️ 如已启用 Cloudflare，旧图会被缓存。建议改文件名，或等 GitHub Actions 自动清缓存 |
| 添加新图片 | 推荐使用 `.webp` 格式，体积更小 |
| 图片尺寸建议 | Hero 轮播图：1920×1280 以内；产品图：800×600 以内 |
| 格式转换 | 使用 `scripts/convert_to_webp.py` 批量转换（需安装 Pillow） |

---

## CSS 版本号说明

首页 `index.html` 引用样式时带有版本号：

```html
<link rel="preload" href="styles/main.css?v=1.7" as="style" ...>
```

**每次修改 `main.css` 后，需要同步修改版本号**（如 `v=1.7` → `v=1.8`），  
这样浏览器和 CDN 会自动加载新版本，不会读到旧缓存。

---

## 配置 Cloudflare CDN（可选，强烈推荐）

### 为什么要用 Cloudflare？

GitHub Pages 默认缓存时间只有 **10 分钟**，用户每次访问都需要重新下载图片。  
接入 Cloudflare 免费套餐后：
- 图片、CSS 等静态资源缓存 **30 天**
- 全球 CDN 节点加速（对欧美买家访问效果明显）
- 自动 Brotli 压缩，进一步减少传输体积

### 第一步：将域名 DNS 托管到 Cloudflare

1. 注册 [Cloudflare 账号](https://www.cloudflare.com)
2. 添加站点 `yarnsvc.com`
3. Cloudflare 会扫描现有 DNS 记录，确认无误后点击继续
4. 到你的**域名注册商**（购买 yarnsvc.com 的地方），将 **Name Server（域名服务器）** 改为 Cloudflare 提供的两个地址，例如：
   ```
   alice.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
5. 等待 DNS 生效（通常 5 分钟～24 小时）

### 第二步：在 Cloudflare 设置缓存规则

进入 Cloudflare 控制台 → **Caching** → **Cache Rules**，添加规则：

- 匹配条件：`URI Path` 包含 `/images/` 或文件扩展名为 `.webp .jpg .png .css .js`
- 缓存行为：**Cache Everything**，TTL 设置为 **30 天**

### 第三步：创建 API Token（用于自动清缓存）

1. 进入 Cloudflare → **My Profile** → **API Tokens**
2. 点击 **Create Token**
3. 使用模板 **Cache Purge**（仅需 Cache Purge 权限）
4. 选择作用域：`Zone → yarnsvc.com`
5. 创建后**复制保存** Token（只显示一次）
6. 同时记录 **Zone ID**（在 yarnsvc.com 域名概览页右下角）

### 第四步：将密钥添加到 GitHub 仓库

1. 打开 GitHub 仓库页面 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加以下两个密钥：

   | 名称 | 值 |
   |------|-----|
   | `CLOUDFLARE_API_TOKEN` | 刚才复制的 API Token |
   | `CLOUDFLARE_ZONE_ID` | yarnsvc.com 的 Zone ID |

### 第五步：创建 GitHub Actions 自动清缓存工作流

在项目中创建文件 `.github/workflows/cloudflare-purge.yml`，内容如下：

```yaml
name: Cloudflare Cache Purge

on:
  push:
    branches:
      - master

jobs:
  purge:
    runs-on: ubuntu-latest
    steps:
      - name: Purge Cloudflare Cache
        uses: jakejarvis/cloudflare-purge-action@master
        env:
          CLOUDFLARE_ZONE: ${{ secrets.CLOUDFLARE_ZONE_ID }}
          CLOUDFLARE_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

> 此文件已在项目 `.github/workflows/cloudflare-purge.yml` 中准备好，  
> 完成第四步添加密钥后即可自动生效。

---

## 配置完成后的工作流

配置 Cloudflare 并添加 GitHub Secrets 后，日常更新流程完全不变：

```
你修改文件
   ↓
GitHub Desktop → Commit → Push
   ↓
GitHub Pages 自动部署（1~3 分钟）
   ↓
GitHub Actions 自动清除 Cloudflare 旧缓存（约 30 秒）
   ↓
访问者看到最新内容 ✅
```

---

## 性能指标（2026-06 优化后）

| 优化项 | 优化前 | 优化后 |
|--------|--------|--------|
| hero3.webp | 287 KB | 72.8 KB（↓75%）|
| 3.webp | 199 KB | 84.3 KB（↓58%）|
| main.css | 41.9 KB | 24.5 KB（↓43%）|
| CSS 渲染阻塞 | 阻塞约 860ms | 关键 CSS 内联，0 阻塞 |
| 无障碍对比度 | 4 处不合规 | 全部 ≥ 5.9:1（WCAG AA）|
| Favicon | 无 | 纱轴图标（透明背景）|

---

## 联系 / 维护

- **网站负责人：** 杉越纺织管理团队
- **GitHub 账号：** ww2100
- **本文档最后更新：** 2026-06-16
