import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../src/component/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化component demo - 使用component版本的渲染
const anxComponentPlugin = markedAnxComponent();
const { renderer: componentRenderer, extensions: componentExtensions } = anxComponentPlugin(marked);

// component demo处理函数
export function handleComponentDemo(req, res) {
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
}
