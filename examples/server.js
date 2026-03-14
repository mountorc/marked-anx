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
  
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Form Demo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
    h1, h2 { color: #333; }
  </style>
  <script type="module" src="../src/component/anx-element.js"></script>
</head>
<body>
  <h1>ANX Form Demo</h1>
  <p>This demo tests the form component.</p>
  <p><a href="/">Home</a> | <a href="/plugin">Plugin Demo</a> | <a href="/element">Element Demo</a> | <a href="/component">Component Demo</a> | <a href="/component-mjs">Component MJS Demo</a> | <a href="/form">Form Demo</a></p>
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
    <a href="/component-mjs">Component MJS Demo</a>
    <a href="/form">Form Demo</a>
    <a href="/editor">Editor Demo</a>
  </div>
  <h2>Demos:</h2>
  <ul>
    <li><strong>/plugin</strong> - Uses marked-anx plugin directly</li>
    <li><strong>/element</strong> - Uses &lt;anx-render&gt; element directly</li>
    <li><strong>/component</strong> - Uses marked-anx component plugin with &lt;anx-render&gt; elements</li>
    <li><strong>/component-mjs</strong> - Uses marked-anx-component.mjs ES module</li>
    <li><strong>/form</strong> - Tests the form component</li>
    <li><strong>/editor</strong> - Markdown editor with live preview</li>
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
  console.log(`Form Demo: http://localhost:${port}/form`);
  console.log(`Editor Demo: http://localhost:${port}/editor`);
});
