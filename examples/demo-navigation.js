import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载导航配置
const navigationConfigPath = path.join(__dirname, 'demo-navigation.json');
const navigationConfig = JSON.parse(fs.readFileSync(navigationConfigPath, 'utf8'));

// 生成导航栏HTML
export function generateNavigation(currentPath = '/') {
  let html = '<nav class="anx-nav">\n';
  html += '  <div class="anx-nav-container">\n';
  html += '    <a href="/" class="anx-nav-logo">marked-ANX-demo</a>\n';
  html += '    <ul class="anx-nav-menu">\n';
  
  // 处理新格式的导航配置
  const navigationItems = navigationConfig.items || navigationConfig;
  
  navigationItems.forEach(item => {
    html += '      <li class="anx-nav-item">\n';
    html += '        <a href="' + item.url_page + '" class="anx-nav-link' + (item.url_page === currentPath ? ' active' : '') + '">' + item.title + '</a>\n';
    html += '      </li>\n';
  });
  
  html += '    </ul>\n';
  html += '  </div>\n';
  html += '</nav>\n';
  
  return html;
}

export default navigationConfig;