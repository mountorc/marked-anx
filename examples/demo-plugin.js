import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnx from '../src/index.js';
import { renderComponentAsync } from '../src/common/renderers.js';
import { generateNavigation } from './demo-navigation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化plugin demo - 使用plugin版本的渲染
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// plugin demo处理函数
export async function handlePluginDemo(req, res) {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo.md');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    console.log('Markdown content (plugin):', testMarkdown);
    let html = marked(testMarkdown, {
      breaks: true,
      gfm: true,
      sanitize: false,
      renderer: renderer,
      extensions: extensions
    });
    
    // 直接从原始markdown文件中提取anx块
    const anxBlocks = testMarkdown.match(/:::anx\n([\s\S]*?)\n:::/g);
    console.log('Found', anxBlocks ? anxBlocks.length : 0, 'anx blocks in markdown');
    
    // 先渲染markdown，不处理anx块
    let markdownHtml = marked(testMarkdown, {
      breaks: true,
      gfm: true,
      sanitize: false,
      renderer: renderer,
      extensions: extensions
    });
    
    // 然后处理anx块
    if (anxBlocks) {
      for (let i = 0; i < anxBlocks.length; i++) {
        const block = anxBlocks[i];
        console.log(`Processing ANX block ${i + 1}:`, block);
        try {
          const jsonContent = block.replace(/:::anx\n|\n:::/g, '').trim();
          console.log(`JSON content for block ${i + 1}:`, jsonContent);
          const component = JSON.parse(jsonContent);
          console.log(`Parsed component ${i + 1}:`, component);
          
          // 异步渲染组件，处理dataset
          const renderedComponent = await renderComponentAsync(component);
          const componentHtml = `<div class="anx-container">${renderedComponent}</div>`;
          
          // 替换markdown渲染后的内容中的anx块
          const blockHtml = marked(block, {
            breaks: true,
            gfm: true,
            sanitize: false
          }).trim();
          console.log(`Block HTML for block ${i + 1}:`, blockHtml);
          markdownHtml = markdownHtml.replace(blockHtml, componentHtml);
        } catch (error) {
          console.error(`ANX plugin error for block ${i + 1}:`, error);
          const errorHtml = `<div class="anx-container"><div class="anx-error">Invalid JSON in block ${i + 1}: ${error.message}</div></div>`;
          const blockHtml = marked(block, {
            breaks: true,
            gfm: true,
            sanitize: false
          }).trim();
          markdownHtml = markdownHtml.replace(blockHtml, errorHtml);
        }
      }
    }
    
    html = markdownHtml;
    
    console.log('Rendered HTML (plugin):', html);
  
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Plugin Demo</title>
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
  <script type="module" src="../src/component/anx-element.js"></script>
</head>
<body>
  <anx-render auto-set='{"showMode":"header"}' value="plugin" src="http://localhost:4665/anx/config/navigation"></anx-render>
  <div class="content">
    <div class="content-header">
      <h1>ANX Plugin Demo</h1>
      <p>This demo uses the marked-anx plugin directly.</p>
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