import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../src/component/index.js';
import { generateNavigation } from './demo-navigation.js';
import { processAnxBlocks } from './demo-anx-component.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化component demo - 使用component版本的渲染
const anxComponentPlugin = markedAnxComponent();
const { renderer: componentRenderer, extensions: componentExtensions } = anxComponentPlugin(marked);

// 测试函数
export function handleEditorDemo(req, res) {
  try {
    // 读取demo.md文件内容
    const demoMarkdownPath = path.join(__dirname, 'demo.md');
    const demoMarkdown = fs.readFileSync(demoMarkdownPath, 'utf8');
    
    // 生成导航栏HTML
    const navHTML = generateNavigation('/editor');
    
    // 使用字符串拼接构建HTML内容
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Marked Markdown Editor</title>
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
    .anx-nav-dropdown {
      position: relative;
    }
    .anx-nav-dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 120px;
      background-color: #ffffff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 4px 0;
      margin-top: 4px;
      display: none;
      z-index: 1000;
    }
    .anx-nav-dropdown:hover .anx-nav-dropdown-menu {
      display: block;
    }
    .anx-nav-dropdown-item {
      padding: 6px 16px;
      color: #606266;
      text-decoration: none;
      display: block;
      transition: all 0.3s ease;
    }
    .anx-nav-dropdown-item:hover {
      color: #409eff;
      background-color: #ecf5ff;
    }
    
    /* 容器样式 */
    .container {
      display: flex;
      height: calc(100vh - 60px);
    }
    .editor, .preview {
      flex: 1;
      padding: 30px;
      overflow: auto;
    }
    .editor {
      background-color: #ffffff;
      border-right: 1px solid #e4e7ed;
    }
    .preview {
      background-color: #f9f9f9;
    }
    
    /* 编辑器样式 */
    .editor-header, .preview-header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e4e7ed;
    }
    .editor-header h1, .preview-header h1 {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
    textarea {
      width: 100%;
      height: calc(100% - 60px);
      border: none;
      outline: none;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      resize: none;
      background-color: transparent;
      color: #303133;
    }
    
    /* 预览样式 */
    #preview {
      min-height: calc(100% - 60px);
      background-color: #ffffff;
      border-radius: 4px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    #preview h1, #preview h2, #preview h3 {
      color: #303133;
      margin-bottom: 16px;
    }
    #preview p {
      margin-bottom: 16px;
      line-height: 1.6;
    }
    #preview code {
      background-color: #f0f2f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
    }
    #preview pre {
      background-color: #f0f2f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
    #preview pre code {
      background-color: transparent;
      padding: 0;
    }
    #preview ul, #preview ol {
      margin-bottom: 16px;
      padding-left: 24px;
    }
    #preview li {
      margin-bottom: 8px;
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
  <script type="module" src="../src/component/anx-element.js"></script>
</head>
<body>
${navHTML}
  <div class="container">
    <div class="editor">
      <div class="editor-header">
        <h1>Markdown Editor</h1>
      </div>
      <textarea id="editor">${demoMarkdown.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</textarea>
    </div>
    <div class="preview">
      <div class="preview-header">
        <h1>Preview</h1>
      </div>
      <div id="preview"></div>
    </div>
  </div>
  <script type="module">
    import { marked } from 'https://cdn.jsdelivr.net/npm/marked@14.1.1/+esm';
    
    function processAnxBlocks(markdown, marked) {
      // 处理anx块 - 直接提取并转换为anx-render元素
      let result = markdown;
      
      // 更灵活的ANX块匹配
      const blocks = markdown.split(':::anx');
      if (blocks.length > 1) {
        result = blocks[0];
        for (let i = 1; i < blocks.length; i++) {
          const block = blocks[i];
          const endIndex = block.indexOf(':::');
          if (endIndex !== -1) {
            const jsonContent = block.substring(0, endIndex).trim();
            const rest = block.substring(endIndex + 3);
            try {
              const component = JSON.parse(jsonContent);
              // 生成anx-render标签
              const renderedComponent = '<anx-render>' + JSON.stringify(component) + '</anx-render>';
              result += renderedComponent + rest;
            } catch (error) {
              const errorComponent = '<anx-render>{"kind": "text", "value": "Invalid JSON: ' + error.message + '"}</anx-render>';
              result += errorComponent + rest;
            }
          } else {
            result += ':::anx' + block;
          }
        }
      }
      
      // 渲染处理后的内容
      return marked(result, {
        breaks: true,
        gfm: true,
        sanitize: false
      });
    }
    
    function render() {
      const editor = document.getElementById('editor');
      const preview = document.getElementById('preview');
      const markdown = editor.value;
      
      try {
        // 使用processAnxBlocks函数处理ANX块
        const html = processAnxBlocks(markdown, marked);
        preview.innerHTML = html;
      } catch (error) {
        console.error('Render error:', error);
        preview.innerHTML = '<div class="anx-error">Render error: ' + error.message + '</div>';
      }
    }
    
    // 初始渲染
    render();
    
    // 添加事件监听器
    const editor = document.getElementById('editor');
    editor.addEventListener('input', render);
  </script>
</body>
</html>`;
    
    // 添加缓存控制头，禁用缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error:', error);
    res.send('<html><head><title>Error</title><style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }</style></head><body><h1>Error</h1><p>' + error.message + '</p><pre>' + error.stack + '</pre></body></html>');
  }
}



// 如果直接运行此文件，启动一个简单的服务器
if (import.meta.url === `file://${process.argv[1]}`) {
  import('express').then(({ default: express }) => {
    const app = express();
    const port = 3004;
    
    app.get('/', handleEditorDemo);
    
    app.listen(port, () => {
      console.log(`Marked editor demo server running at http://localhost:${port}`);
    });
  });
}
