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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4664;

// 提供静态文件服务
app.use(express.static(__dirname + '/../'));

// plugin demo路径
app.get('/plugin', handlePluginDemo);

// component demo路径 - 使用handleComponentDemo函数
app.get('/component', handleComponentDemo);

// component mjs demo路径 - 使用handleComponentMjsDemo函数
app.get('/component-mjs', handleComponentMjsDemo);

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
    <a href="/component-mjs">Component MJS Demo</a>
  </div>
  <h2>Demos:</h2>
  <ul>
    <li><strong>/plugin</strong> - Uses marked-anx plugin directly</li>
    <li><strong>/element</strong> - Uses &lt;anx-render&gt; element directly</li>
    <li><strong>/component</strong> - Uses marked-anx component plugin with &lt;anx-render&gt; elements</li>
    <li><strong>/component-mjs</strong> - Uses marked-anx-component.mjs ES module</li>
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
  console.log(`Component MJS Demo: http://localhost:${port}/component-mjs`);
});
