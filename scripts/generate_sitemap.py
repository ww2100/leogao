import os
import urllib.parse
from datetime import datetime

# 配置
BASE_URL = "https://www.yarnsvc.com/"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITEMAP_PATH = os.path.join(ROOT_DIR, "sitemap.xml")

# 需要忽略的文件或目录
IGNORE_FILES = {"google-site-verification", "404.html"}
IGNORE_DIRS = {".git", ".github", "backup", "scripts", "styles", "images", ".vscode", ".workbuddy"}

def get_html_files():
    html_files = []
    
    # 遍历根目录和子目录
    for root, dirs, files in os.walk(ROOT_DIR):
        # 排除忽略的目录
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file.endswith(".html"):
                file_name_without_ext = os.path.splitext(file)[0]
                if file_name_without_ext in IGNORE_FILES:
                    continue
                
                # 计算相对路径
                rel_path = os.path.relpath(os.path.join(root, file), ROOT_DIR)
                if rel_path == "index.html":
                    # 首页使用根路径 /
                    html_files.append(("", 1.0))
                else:
                    # 将 Windows 路径分隔符替换为 URL 斜杠，并进行 URL 编码
                    url_path = rel_path.replace(os.sep, "/")
                    encoded_path = urllib.parse.quote(url_path)
                    
                    # 设置权重：二级页面 0.8，新闻文章页 0.6
                    priority = 0.8
                    if url_path.startswith("news/"):
                        priority = 0.6
                    
                    html_files.append((encoded_path, priority))
                    
    return sorted(html_files, key=lambda x: (-x[1], x[0]))

def generate_sitemap():
    pages = get_html_files()
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for path, priority in pages:
        loc = f"{BASE_URL}{path}"
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{loc}</loc>\n'
        xml_content += f'    <priority>{priority:.2f}</priority>\n'
        xml_content += '  </url>\n'
        
    xml_content += '</urlset>\n'
    
    # 写入文件
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    print(f"成功更新 sitemap.xml，共包含 {len(pages)} 个网页链接。")

if __name__ == "__main__":
    generate_sitemap()
