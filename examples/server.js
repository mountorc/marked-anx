#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { marked } from 'marked';
import { handlePluginDemo } from './demo-plugin.js';
import { handleComponentMjsDemo } from './demo-component-mjs.js';
import { handleDatasetDemo } from './demo-dataset.js';
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

// component demo路径
app.get('/component', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'demo-component.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// component mjs demo路径 - 使用handleComponentMjsDemo函数
app.get('/component-mjs', handleComponentMjsDemo);

// editor demo路径
app.get('/editor', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'demo-editor.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// dataset demo路径
app.get('/dataset', handleDatasetDemo);

// demo-marked-anx路径
app.get('/demo-marked-anx', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'demo-marked-anx.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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



// test-navigation路径
app.get('/test-navigation', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'test-navigation.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// form demo路径
app.get('/form', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'demo-form.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// trigger and tap test路径
app.get('/test-trigger-and-tap', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'test-trigger-and-tap.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// text tap test路径
app.get('/test-text-tap', (req, res) => {
  try {
    const demoHtmlPath = path.join(__dirname, 'test-text-tap.html');
    const demoHtml = fs.readFileSync(demoHtmlPath, 'utf8');
  
    res.send(demoHtml);
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

// 导航配置 API 接口
app.get('/anx/config/navigation', (req, res) => {
  try {
    const navigationPath = path.join(__dirname, 'demo-navigation.json');
    const navigationContent = fs.readFileSync(navigationPath, 'utf8');
    const navigationConfig = JSON.parse(navigationContent);
    
    res.json({ config: navigationConfig });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 首页
app.get('/', (req, res) => {
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
  <script type="module" src="../src/component/anx-element.js"></script>
</head>
<body>
  <anx-render auto-set='{"showMode":"header"}' src="http://localhost:4665/anx/config/navigation"></anx-render>
  <div class="content">
    <div class="content-header">
      <h1>marked-ANX-demo</h1>
      <p>Welcome to the marked-ANX-demo page!</p>
    </div>
    <div class="demo-list">
      <h2>Demos:</h2>
      <ul>
        ${(navigationConfig.items || navigationConfig).map(item => {
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
            case '/dataset':
              description = 'Returns mock dataset in {"data":[]} format';
              break;
            case '/demo-marked-anx':
              description = 'Marked ANX component demo';
              break;

            case '/test-navigation':
              description = 'Navigation test with remote src';
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
  console.log(`Dataset Demo: http://localhost:${port}/dataset`);
  console.log(`Marked ANX Demo: http://localhost:${port}/demo-marked-anx`);
  console.log(`Trigger and Tap Test: http://localhost:${port}/test-trigger-and-tap`);
  console.log(`Text Tap Test: http://localhost:${port}/test-text-tap`);
});
