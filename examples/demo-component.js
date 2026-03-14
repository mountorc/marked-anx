import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../src/component/index.js';
import { generateNavigation } from './demo-navigation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化component demo - 使用component版本的渲染
const anxComponentPlugin = markedAnxComponent();
const { renderer: componentRenderer, extensions: componentExtensions } = anxComponentPlugin(marked);

// component demo处理函数
export function handleComponentDemo(req, res) {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo.md');
    let testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    console.log('Markdown content (component):', testMarkdown);
    
    // 渲染Markdown
    let html = marked(testMarkdown, { 
      breaks: true, 
      gfm: true, 
      sanitize: false,
      renderer: componentRenderer,
      extensions: componentExtensions
    });
    
    // 处理:::anx语法块
    html = html.replace(/<p>:::anx<br>([\s\S]*?)<br>:::<\/p>/g, (match, content) => {
      try {
        // 移除<br>标签并解析JSON
        const jsonContent = content.replace(/<br>/g, '\n').replace(/&quot;/g, '"');
        const component = JSON.parse(jsonContent);
        return `<anx-render>${JSON.stringify(component)}</anx-render>`;
      } catch (error) {
        console.error('ANX plugin error:', error);
        return `<anx-render>{"kind": "text", "value": "Invalid JSON: ${error.message}"}</anx-render>`;
      }
    });
    
    console.log('Rendered HTML (component):', html);
  
    // 生成导航栏HTML
    const navHTML = generateNavigation('/component');
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Component Demo</title>
  <script type="module" src="../src/component/anx-element.js"></script>
  <style>
    /* 全局样式 */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
    }
    
    /* 导航栏样式 */
    .anx-nav {
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0 20px;
    }
    .anx-nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }
    .anx-nav-logo {
      font-size: 18px;
      font-weight: bold;
      color: #409eff;
      text-decoration: none;
    }
    .anx-nav-menu {
      display: flex;
      list-style: none;
    }
    .anx-nav-item {
      margin-left: 20px;
      position: relative;
    }
    .anx-nav-link {
      display: block;
      padding: 8px 12px;
      color: #606266;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .anx-nav-link:hover {
      color: #409eff;
      background-color: #ecf5ff;
    }
    .anx-nav-link.active {
      color: #409eff;
      font-weight: 500;
      background-color: #ecf5ff;
    }
    
    /* 内容样式 */
    .content {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }
    .content-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;
    }
    .content-header h1 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 10px;
    }
    .content-header p {
      color: #606266;
      font-size: 14px;
    }
    
    /* ANX组件样式 */
    .anx-container {
      border: 1px solid #e4e7ed;
      padding: 20px;
      margin: 20px 0;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .anx-box {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .anx-box-title {
      background-color: #f5f7fa;
      padding: 12px 16px;
      font-weight: 600;
      border-bottom: 1px solid #e4e7ed;
      color: #303133;
    }
    .anx-box-content {
      padding: 16px;
    }
    .anx-box-item {
      border: 1px solid #ebeef5;
      padding: 12px;
      margin: 8px 0;
      border-radius: 4px;
      background-color: #ffffff;
    }
    .anx-board {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }
    .anx-text {
      padding: 12px;
      color: #303133;
    }
    .anx-input-wrapper {
      margin: 12px 0;
    }
    .anx-input {
      padding: 10px 14px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }
    .anx-input:focus {
      outline: none;
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
    .anx-button {
      padding: 10px 20px;
      background-color: #409eff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .anx-button:hover {
      background-color: #66b1ff;
    }
    .anx-error {
      color: #f56c6c;
      background-color: #fef0f0;
      border: 1px solid #fbc4c4;
      padding: 12px;
      border-radius: 4px;
      margin: 12px 0;
    }
    .product {
      border: 1px solid #ebeef5;
      padding: 16px;
      margin: 12px 0;
      border-radius: 8px;
      background-color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .product h2 {
      margin-top: 0;
      font-size: 18px;
      color: #303133;
    }
    .price {
      color: #f56c6c;
      font-weight: bold;
      font-size: 16px;
    }
  </style>
</head>
<body>
${navHTML}
  <div class="content">
    <div class="content-header">
      <h1>ANX Component Demo</h1>
      <p>This demo uses the anx-component.js marked plugin with &lt;anx-render&gt; elements for visualization.</p>
    </div>
    ${html}
  </div>
</body>
</html>
    `);
  } catch (error) {
    console.error('Error:', error);
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
  </style>
</head>
<body>
  <h1>Error</h1>
  <p>${error.message}</p>
  <pre>${error.stack}</pre>
</body>
</html>
    `);
  }
}
