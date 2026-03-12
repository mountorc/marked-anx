#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { marked } from 'marked';
import markedAnx from '../src/plugin/index.js';
import markedAnxComponent from '../src/component/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4664;

// 提供静态文件服务
app.use(express.static(__dirname + '/../'));

// 初始化marked plugin demo - 使用plugin版本的渲染
const anxPlugin = markedAnx();
const { renderer: pluginRenderer, extensions: pluginExtensions } = anxPlugin(marked);
const pluginMarked = marked.defaults ? marked.defaults : marked;

// plugin demo路径
app.get('/plugin', (req, res) => {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo.md');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    console.log('Markdown content (plugin):', testMarkdown);
    
    // 渲染Markdown
    const html = marked(testMarkdown, { 
      breaks: true, 
      gfm: true, 
      sanitize: false,
      renderer: pluginRenderer,
      extensions: pluginExtensions
    });
    console.log('Rendered HTML (plugin):', html);
  
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Plugin Demo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
    h1, h2 { color: #333; }
    .anx-container { 
      border: 1px solid #ddd; 
      padding: 15px; 
      margin: 20px 0; 
      background-color: #f9f9f9; 
      border-radius: 4px; 
    }
    .anx-box { 
      border: 1px solid #e8e8e8; 
      border-radius: 8px; 
      margin: 10px 0; 
      overflow: hidden; 
    }
    .anx-box-title { 
      background-color: #f0f0f0; 
      padding: 10px 15px; 
      font-weight: bold; 
      border-bottom: 1px solid #e8e8e8; 
    }
    .anx-box-content { 
      padding: 15px; 
    }
    .anx-box-item { 
      border: 1px solid #e0e0e0; 
      padding: 10px; 
      margin: 5px 0; 
      border-radius: 4px; 
      background-color: #fff; 
    }
    .anx-board { 
      display: flex; 
      flex-direction: column; 
      gap: 10px; 
      padding: 10px; 
    }
    .anx-text { 
      padding: 10px; 
      color: #333; 
    }
    .anx-input-wrapper { 
      margin: 10px 0; 
    }
    .anx-input { 
      padding: 8px 12px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      width: 100%; 
      box-sizing: border-box; 
    }
    .anx-button { 
      padding: 8px 16px; 
      background-color: #409eff; 
      color: white; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
    }
    .anx-button:hover { 
      background-color: #66b1ff; 
    }
    .anx-error { 
      color: #f56c6c; 
      background-color: #fef0f0; 
      border: 1px solid #fbc4c4; 
      padding: 10px; 
      border-radius: 4px; 
    }
    .product { 
      border: 1px solid #e0e0e0; 
      padding: 10px; 
      margin: 5px 0; 
      border-radius: 4px; 
    }
    .product h2 { 
      margin-top: 0; 
      font-size: 18px; 
    }
    .price { 
      color: #f56c6c; 
      font-weight: bold; 
    }
  </style>
</head>
<body>
  <h1>ANX Plugin Demo</h1>
  <p>This demo uses the marked-anx plugin directly.</p>
  <p><a href="/">Home</a> | <a href="/plugin">Plugin Demo</a> | <a href="/element">Element Demo</a> | <a href="/component">Component Demo</a></p>
  ${html}
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

// 初始化component demo路径
const anxComponentPlugin = markedAnxComponent();
const { renderer: componentRenderer, extensions: componentExtensions } = anxComponentPlugin(marked);

// component demo路径
app.get('/component', (req, res) => {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo.md');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    console.log('Markdown content (component):', testMarkdown);
    
    // 渲染Markdown
    const html = marked(testMarkdown, { 
      breaks: true, 
      gfm: true, 
      sanitize: false,
      renderer: componentRenderer,
      extensions: componentExtensions
    });
    console.log('Rendered HTML (component):', html);
  
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Component Demo</title>
  <script type="module" src="../src/component/anx-element.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
    h1, h2 { color: #333; }
  </style>
</head>
<body>
  <h1>ANX Component Demo</h1>
  <p>This demo uses the anx-component.js marked plugin with &lt;anx-render&gt; elements for visualization.</p>
  <p><a href="/">Home</a> | <a href="/plugin">Plugin Demo</a> | <a href="/element">Element Demo</a> | <a href="/component">Component Demo</a></p>
  ${html}
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
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Demo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
    h1 { color: #333; }
    .nav { margin: 20px 0; }
    .nav a { margin-right: 10px; padding: 8px 16px; background-color: #409eff; color: white; text-decoration: none; border-radius: 4px; }
    .nav a:hover { background-color: #66b1ff; }
  </style>
</head>
<body>
  <h1>ANX Demo</h1>
  <p>Welcome to the ANX demo page!</p>
  <div class="nav">
    <a href="/">Home</a>
    <a href="/plugin">Plugin Demo</a>
    <a href="/element">Element Demo</a>
    <a href="/component">Component Demo</a>
  </div>
  <h2>Demos:</h2>
  <ul>
    <li><strong>/plugin</strong> - Uses marked-anx plugin directly</li>
    <li><strong>/element</strong> - Uses &lt;anx-render&gt; element directly</li>
    <li><strong>/component</strong> - Uses marked-anx component plugin with &lt;anx-render&gt; elements</li>
  </ul>
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
});
