import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../dist/marked-anx-component.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试函数
export function handleEditorDemo(req, res) {
  try {
    // 读取demo.md文件内容
    const demoMarkdownPath = path.join(__dirname, 'demo.md');
    const demoMarkdown = fs.readFileSync(demoMarkdownPath, 'utf8');
    
    // 使用字符串拼接构建HTML内容
    const htmlContent = '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '  <title>Marked Markdown Editor</title>\n' +
      '  <style>\n' +
      '    body {\n' +
      '      font-family: Arial, sans-serif;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '      background-color: #f5f5f5;\n' +
      '    }\n' +
      '    .container {\n' +
      '      display: flex;\n' +
      '      height: 100vh;\n' +
      '    }\n' +
      '    .editor, .preview {\n' +
      '      flex: 1;\n' +
      '      padding: 20px;\n' +
      '      overflow: auto;\n' +
      '    }\n' +
      '    .editor {\n' +
      '      background-color: #f0f0f0;\n' +
      '      border-right: 1px solid #ddd;\n' +
      '    }\n' +
      '    .preview {\n' +
      '      background-color: white;\n' +
      '    }\n' +
      '    textarea {\n' +
      '      width: 100%;\n' +
      '      height: 100%;\n' +
      '      border: none;\n' +
      '      outline: none;\n' +
      '      font-family: monospace;\n' +
      '      font-size: 14px;\n' +
      '      line-height: 1.5;\n' +
      '      resize: none;\n' +
      '      background-color: transparent;\n' +
      '    }\n' +
      '    h1, h2, h3 {\n' +
      '      color: #333;\n' +
      '    }\n' +
      '    .anx-container {\n' +
      '      border: 1px solid #ddd;\n' +
      '      padding: 15px;\n' +
      '      margin: 20px 0;\n' +
      '      background-color: #f9f9f9;\n' +
      '      border-radius: 4px;\n' +
      '    }\n' +
      '    .anx-box {\n' +
      '      border: 1px solid #e8e8e8;\n' +
      '      border-radius: 8px;\n' +
      '      margin: 10px 0;\n' +
      '      overflow: hidden;\n' +
      '    }\n' +
      '    .anx-box-title {\n' +
      '      background-color: #f0f0f0;\n' +
      '      padding: 10px 15px;\n' +
      '      font-weight: bold;\n' +
      '      border-bottom: 1px solid #e8e8e8;\n' +
      '    }\n' +
      '    .anx-box-content {\n' +
      '      padding: 15px;\n' +
      '    }\n' +
      '    .anx-box-item {\n' +
      '      border: 1px solid #e0e0e0;\n' +
      '      padding: 10px;\n' +
      '      margin: 5px 0;\n' +
      '      border-radius: 4px;\n' +
      '      background-color: #fff;\n' +
      '    }\n' +
      '    .anx-board {\n' +
      '      display: flex;\n' +
      '      flex-direction: column;\n' +
      '      gap: 10px;\n' +
      '      padding: 10px;\n' +
      '    }\n' +
      '    .anx-text {\n' +
      '      padding: 10px;\n' +
      '      color: #333;\n' +
      '    }\n' +
      '    .anx-input-wrapper {\n' +
      '      margin: 10px 0;\n' +
      '    }\n' +
      '    .anx-input {\n' +
      '      padding: 8px 12px;\n' +
      '      border: 1px solid #ddd;\n' +
      '      border-radius: 4px;\n' +
      '      width: 100%;\n' +
      '      box-sizing: border-box;\n' +
      '    }\n' +
      '    .anx-button {\n' +
      '      padding: 8px 16px;\n' +
      '      background-color: #409eff;\n' +
      '      color: white;\n' +
      '      border: none;\n' +
      '      border-radius: 4px;\n' +
      '      cursor: pointer;\n' +
      '    }\n' +
      '    .anx-button:hover {\n' +
      '      background-color: #66b1ff;\n' +
      '    }\n' +
      '    .anx-error {\n' +
      '      color: #f56c6c;\n' +
      '      background-color: #fef0f0;\n' +
      '      border: 1px solid #fbc4c4;\n' +
      '      padding: 10px;\n' +
      '      border-radius: 4px;\n' +
      '    }\n' +
      '    .product {\n' +
      '      border: 1px solid #e0e0e0;\n' +
      '      padding: 10px;\n' +
      '      margin: 5px 0;\n' +
      '      border-radius: 4px;\n' +
      '    }\n' +
      '    .product h2 {\n' +
      '      margin-top: 0;\n' +
      '      font-size: 18px;\n' +
      '    }\n' +
      '    .price {\n' +
      '      color: #f56c6c;\n' +
      '      font-weight: bold;\n' +
      '    }\n' +
      '  </style>\n' +
      '  <script type="module" src="../dist/anx-element.mjs"></script>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <div class="container">\n' +
      '    <div class="editor">\n' +
      '      <h1>Markdown Editor</h1>\n' +
      '      <textarea id="editor">' + demoMarkdown + '</textarea>\n' +
      '    </div>\n' +
      '    <div class="preview">\n' +
      '      <h1>Preview</h1>\n' +
      '      <div id="preview"></div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <script type="module">\n' +
      '    import { marked } from \'https://cdn.jsdelivr.net/npm/marked@14.1.1/+esm\';\n' +
      '    import markedAnxComponent from \'../dist/marked-anx-component.mjs\';\n' +
      '    \n' +
      '    // 初始化ANX组件插件\n' +
      '    const anxComponentPlugin = markedAnxComponent();\n' +
      '    const { renderer, extensions } = anxComponentPlugin(marked);\n' +
      '    \n' +
      '    function render() {\n' +
      '      const editor = document.getElementById(\'editor\');\n' +
      '      const preview = document.getElementById(\'preview\');\n' +
      '      const markdown = editor.value;\n' +
      '      \n' +
      '      try {\n' +
      '        // 渲染Markdown\n' +
      '        let html = marked(markdown, {\n' +
      '          breaks: true,\n' +
      '          gfm: true,\n' +
      '          sanitize: false,\n' +
      '          renderer: renderer,\n' +
      '          extensions: extensions\n' +
      '        });\n' +
      '        \n' +
      '        // 处理:::anx语法块\n' +
      '        html = html.replace(/<p>:::anx<br>([\\s\\S]*?)<br>:::<\\/p>/g, function(match, content) {\n' +
      '          try {\n' +
      '            // 移除<br>标签并解析JSON\n' +
      '            const jsonContent = content.replace(/<br>/g, \'\\n\').replace(/&quot;/g, \'"\');\n' +
      '            const component = JSON.parse(jsonContent);\n' +
      '            return \'<anx-render>\' + JSON.stringify(component) + \'</anx-render>\';\n' +
      '          } catch (error) {\n' +
      '            console.error(\'ANX plugin error:\', error);\n' +
      '            return \'<anx-render>{"kind": "text", "value": "Invalid JSON: \' + error.message + \'"}</anx-render>\';\n' +
      '          }\n' +
      '        });\n' +
      '        \n' +
      '        preview.innerHTML = html;\n' +
      '      } catch (error) {\n' +
      '        console.error(\'Render error:\', error);\n' +
      '        preview.innerHTML = \'<div class="anx-error">Render error: \' + error.message + \'</div>\';\n' +
      '      }\n' +
      '    }\n' +
      '    \n' +
      '    // 初始渲染\n' +
      '    render();\n' +
      '    \n' +
      '    // 添加事件监听器\n' +
      '    const editor = document.getElementById(\'editor\');\n' +
      '    editor.addEventListener(\'input\', render);\n' +
      '  </script>\n' +
      '</body>\n' +
      '</html>';
    
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