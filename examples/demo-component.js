import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../src/component/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3002;

// 提供静态文件服务
app.use(express.static(__dirname + '/../'));

// 使用和demo-plugin.js相同的模式来注册插件
const anxPlugin = markedAnxComponent();
const { renderer, extensions } = anxPlugin(marked);
marked.use({
  renderer: renderer,
  extensions: extensions
});

app.get('/', (req, res) => {
  try {
    const testMarkdownPath = path.join(__dirname, 'demo.md');
    const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');
    console.log('Markdown content:', testMarkdown);
    
    // 渲染Markdown，禁用HTML转义
    const html = marked(testMarkdown, { breaks: true, gfm: true, sanitize: false });
    console.log('Rendered HTML:', html);
  
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ANX Element Test</title>
  <script type="module" src="../src/component/anx-element.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; color: black; }
    h1, h2 { color: #333; }
  </style>
</head>
<body>
  <h1>ANX Element Test</h1>
  <p>This demo uses the anx-component.js marked plugin with &lt;anx-render&gt; elements for visualization.</p>
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});