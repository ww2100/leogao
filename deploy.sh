#!/bin/bash
# ─────────────────────────────────────────
#  Shanyue Textile — 一键发布脚本
#  用法：在终端运行  bash deploy.sh
# ─────────────────────────────────────────

cd "$(dirname "$0")"

echo "🔍 正在自动更新站点地图 sitemap.xml..."
python3 scripts/generate_sitemap.py

echo ""
echo "📦 正在收集改动..."
git add -A

# 自动生成提交说明（含日期时间）
COMMIT_MSG="Update $(date '+%Y-%m-%d %H:%M')"

echo "✏️  提交信息：$COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo ""
echo "🚀 正在上传到 GitHub..."
git push origin master

echo ""
echo "✅ 完成！网站通常在 1~3 分钟内更新上线。"
echo ""
