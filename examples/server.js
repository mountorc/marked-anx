#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { marked } from 'marked';
import { handlePluginDemo } from './demo-plugin.js';
import { handleComponentDemo } from './demo-component.js';
import { handleComponentMjsDemo } from './demo-component-mjs.js';
import { handleEditorDemo } from './demo-editor.js';
import { generateNavigation } from './demo-navigation.js';
import navigationConfig from './demo-navigation.js';
import markedAnxComponent from '../src/component/index.js';

// 初始化插件
const anxComponentPlugin = markedAnxComponent();
const { renderer: componentRenderer, extensions: componentExtensions } = anxComponentPlugin(marked);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4665;

// 提供静态文件服务
app.use(express.static(__dirname + '/../'));

// plugin demo路径
app.get('/plugin', handlePluginDemo);

// component demo路径 - 使用handleComponentDemo函数
app.get('/component', handleComponentDemo);

// component mjs demo路径 - 使用handleComponentMjsDemo函数
app.get('/component-mjs', handleComponentMjsDemo);

// editor demo路径
app.get('/editor', handleEditorDemo);

// form demo路径
app.get('/form', (req, res) => {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo-form.md');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    
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
  
    // 生成导航栏HTML
    const navHTML = generateNavigation('/form');
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Form Demo</title>
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
  </style>
  <script type="module" src="../src/component/anx-element.js"></script>
</head>
<body>
${navHTML}
  <div class="content">
    <div class="content-header">
      <h1>ANX Form Demo</h1>
      <p>This demo tests the form component.</p>
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
});

// element demo路径
app.get('/element', (req, res) => {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo-element.html');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
  
    res.send(testMarkdown);
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
});

// 首页
app.get('/', (req, res) => {
  // 生成导航栏HTML
  const navHTML = generateNavigation('/');
  
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Demo</title>
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
    
    /* 演示列表样式 */
    .demo-list {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .demo-list h2 {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 15px;
    }
    .demo-list ul {
      list-style: none;
      padding: 0;
    }
    .demo-list li {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .demo-list li:last-child {
      border-bottom: none;
    }
    .demo-list strong {
      color: #409eff;
    }
  </style>
</head>
<body>
${navHTML}
  <div class="content">
    <div class="content-header">
      <h1>marked-ANX-demo</h1>
      <p>Welcome to the marked-ANX-demo page!</p>
    </div>
    <div class="demo-list">
      <h2>Demos:</h2>
      <ul>
        ${navigationConfig.map(item => {
          let description = '';
          switch(item.url_page) {
            case '/':
              description = 'Home page with demo list';
              break;
            case '/plugin':
              description = 'Uses marked-anx plugin directly';
              break;
            case '/element':
              description = 'Uses &lt;anx-render&gt; element directly';
              break;
            case '/component':
              description = 'Uses marked-anx component plugin with &lt;anx-render&gt; elements';
              break;
            case '/component-mjs':
              description = 'Uses marked-anx-component.mjs ES module';
              break;
            case '/form':
              description = 'Tests the form component';
              break;
            case '/editor':
              description = 'Markdown editor with live preview';
              break;
            default:
              description = '';
          }
          return `<li><strong>${item.url_page}</strong> - ${description}</li>`;
        }).join('')}
      </ul>
    </div>
  </div>
</body>
</html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Home: http://localhost:${port}/`);
  console.log(`Plugin Demo: http://localhost:${port}/plugin`);
  console.log(`Element Demo: http://localhost:${port}/element`);
  console.log(`Component Demo: http://localhost:${port}/component`);
  console.log(`Component MJS Demo: http://localhost:${port}/component-mjs`);
  console.log(`Form Demo: http://localhost:${port}/form`);
  console.log(`Editor Demo: http://localhost:${port}/editor`);
});
