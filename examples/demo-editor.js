import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import markedAnxComponent from '../dist/marked-anx-component.mjs';
import { generateNavigation } from './demo-navigation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试函数
export function handleEditorDemo(req, res) {
  try {
    // 读取demo.md文件内容
    const demoMarkdownPath = path.join(__dirname, 'demo.md');
    const demoMarkdown = fs.readFileSync(demoMarkdownPath, 'utf8');
    
    // 生成导航栏HTML
    const navHTML = generateNavigation('/editor');
    
    // 使用字符串拼接构建HTML内容
    const htmlContent = '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '  <title>Marked Markdown Editor</title>\n' +
      '  <style>\n' +
      '    /* 全局样式 */\n' +
      '    * {\n' +
      '      box-sizing: border-box;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '    }\n' +
      '    body {\n' +
      '      font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '      background-color: #f5f7fa;\n' +
      '      color: #333;\n' +
      '    }\n' +
      '    \n' +
      '    /* 导航栏样式 */\n' +
      '    .anx-nav {\n' +
      '      background-color: #ffffff;\n' +
      '      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n' +
      '      padding: 0 20px;\n' +
      '    }\n' +
      '    .anx-nav-container {\n' +
      '      max-width: 1200px;\n' +
      '      margin: 0 auto;\n' +
      '      display: flex;\n' +
      '      justify-content: space-between;\n' +
      '      align-items: center;\n' +
      '      height: 60px;\n' +
      '    }\n' +
      '    .anx-nav-logo {\n' +
      '      font-size: 18px;\n' +
      '      font-weight: bold;\n' +
      '      color: #409eff;\n' +
      '      text-decoration: none;\n' +
      '    }\n' +
      '    .anx-nav-menu {\n' +
      '      display: flex;\n' +
      '      list-style: none;\n' +
      '    }\n' +
      '    .anx-nav-item {\n' +
      '      margin-left: 20px;\n' +
      '      position: relative;\n' +
      '    }\n' +
      '    .anx-nav-link {\n' +
      '      display: block;\n' +
      '      padding: 8px 12px;\n' +
      '      color: #606266;\n' +
      '      text-decoration: none;\n' +
      '      border-radius: 4px;\n' +
      '      transition: all 0.3s ease;\n' +
      '    }\n' +
      '    .anx-nav-link:hover {\n' +
      '      color: #409eff;\n' +
      '      background-color: #ecf5ff;\n' +
      '    }\n' +
      '    .anx-nav-link.active {\n' +
      '      color: #409eff;\n' +
      '      font-weight: 500;\n' +
      '      background-color: #ecf5ff;\n' +
      '    }\n' +
      '    .anx-nav-dropdown {\n' +
      '      position: relative;\n' +
      '    }\n' +
      '    .anx-nav-dropdown-menu {\n' +
      '      position: absolute;\n' +
      '      top: 100%;\n' +
      '      left: 0;\n' +
      '      min-width: 120px;\n' +
      '      background-color: #ffffff;\n' +
      '      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\n' +
      '      border-radius: 4px;\n' +
      '      padding: 4px 0;\n' +
      '      margin-top: 4px;\n' +
      '      display: none;\n' +
      '      z-index: 1000;\n' +
      '    }\n' +
      '    .anx-nav-dropdown:hover .anx-nav-dropdown-menu {\n' +
      '      display: block;\n' +
      '    }\n' +
      '    .anx-nav-dropdown-item {\n' +
      '      padding: 6px 16px;\n' +
      '      color: #606266;\n' +
      '      text-decoration: none;\n' +
      '      display: block;\n' +
      '      transition: all 0.3s ease;\n' +
      '    }\n' +
      '    .anx-nav-dropdown-item:hover {\n' +
      '      color: #409eff;\n' +
      '      background-color: #ecf5ff;\n' +
      '    }\n' +
      '    \n' +
      '    /* 容器样式 */\n' +
      '    .container {\n' +
      '      display: flex;\n' +
      '      height: calc(100vh - 60px);\n' +
      '    }\n' +
      '    .editor, .preview {\n' +
      '      flex: 1;\n' +
      '      padding: 30px;\n' +
      '      overflow: auto;\n' +
      '    }\n' +
      '    .editor {\n' +
      '      background-color: #ffffff;\n' +
      '      border-right: 1px solid #e4e7ed;\n' +
      '    }\n' +
      '    .preview {\n' +
      '      background-color: #f9f9f9;\n' +
      '    }\n' +
      '    \n' +
      '    /* 编辑器样式 */\n' +
      '    .editor-header, .preview-header {\n' +
      '      margin-bottom: 20px;\n' +
      '      padding-bottom: 10px;\n' +
      '      border-bottom: 1px solid #e4e7ed;\n' +
      '    }\n' +
      '    .editor-header h1, .preview-header h1 {\n' +
      '      font-size: 20px;\n' +
      '      font-weight: 600;\n' +
      '      color: #303133;\n' +
      '    }\n' +
      '    textarea {\n' +
      '      width: 100%;\n' +
      '      height: calc(100% - 60px);\n' +
      '      border: none;\n' +
      '      outline: none;\n' +
      '      font-family: \'Consolas\', \'Monaco\', \'Courier New\', monospace;\n' +
      '      font-size: 14px;\n' +
      '      line-height: 1.6;\n' +
      '      resize: none;\n' +
      '      background-color: transparent;\n' +
      '      color: #303133;\n' +
      '    }\n' +
      '    \n' +
      '    /* 预览样式 */\n' +
      '    #preview {\n' +
      '      min-height: calc(100% - 60px);\n' +
      '      background-color: #ffffff;\n' +
      '      border-radius: 4px;\n' +
      '      padding: 30px;\n' +
      '      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n' +
      '    }\n' +
      '    #preview h1, #preview h2, #preview h3 {\n' +
      '      color: #303133;\n' +
      '      margin-bottom: 16px;\n' +
      '    }\n' +
      '    #preview p {\n' +
      '      margin-bottom: 16px;\n' +
      '      line-height: 1.6;\n' +
      '    }\n' +
      '    #preview code {\n' +
      '      background-color: #f0f2f5;\n' +
      '      padding: 2px 4px;\n' +
      '      border-radius: 3px;\n' +
      '      font-family: \'Consolas\', \'Monaco\', \'Courier New\', monospace;\n' +
      '      font-size: 13px;\n' +
      '    }\n' +
      '    #preview pre {\n' +
      '      background-color: #f0f2f5;\n' +
      '      padding: 16px;\n' +
      '      border-radius: 4px;\n' +
      '      overflow-x: auto;\n' +
      '      margin-bottom: 16px;\n' +
      '    }\n' +
      '    #preview pre code {\n' +
      '      background-color: transparent;\n' +
      '      padding: 0;\n' +
      '    }\n' +
      '    #preview ul, #preview ol {\n' +
      '      margin-bottom: 16px;\n' +
      '      padding-left: 24px;\n' +
      '    }\n' +
      '    #preview li {\n' +
      '      margin-bottom: 8px;\n' +
      '    }\n' +
      '    \n' +
      '    /* ANX组件样式 */\n' +
      '    .anx-container {\n' +
      '      border: 1px solid #e4e7ed;\n' +
      '      padding: 20px;\n' +
      '      margin: 20px 0;\n' +
      '      background-color: #ffffff;\n' +
      '      border-radius: 8px;\n' +
      '      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n' +
      '    }\n' +
      '    .anx-box {\n' +
      '      border: 1px solid #e4e7ed;\n' +
      '      border-radius: 8px;\n' +
      '      margin: 16px 0;\n' +
      '      overflow: hidden;\n' +
      '      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n' +
      '    }\n' +
      '    .anx-box-title {\n' +
      '      background-color: #f5f7fa;\n' +
      '      padding: 12px 16px;\n' +
      '      font-weight: 600;\n' +
      '      border-bottom: 1px solid #e4e7ed;\n' +
      '      color: #303133;\n' +
      '    }\n' +
      '    .anx-box-content {\n' +
      '      padding: 16px;\n' +
      '    }\n' +
      '    .anx-box-item {\n' +
      '      border: 1px solid #ebeef5;\n' +
      '      padding: 12px;\n' +
      '      margin: 8px 0;\n' +
      '      border-radius: 4px;\n' +
      '      background-color: #ffffff;\n' +
      '    }\n' +
      '    .anx-board {\n' +
      '      display: flex;\n' +
      '      flex-direction: column;\n' +
      '      gap: 12px;\n' +
      '      padding: 12px;\n' +
      '    }\n' +
      '    .anx-text {\n' +
      '      padding: 12px;\n' +
      '      color: #303133;\n' +
      '    }\n' +
      '    .anx-input-wrapper {\n' +
      '      margin: 12px 0;\n' +
      '    }\n' +
      '    .anx-input {\n' +
      '      padding: 10px 14px;\n' +
      '      border: 1px solid #dcdfe6;\n' +
      '      border-radius: 4px;\n' +
      '      width: 100%;\n' +
      '      box-sizing: border-box;\n' +
      '      transition: border-color 0.3s ease;\n' +
      '    }\n' +
      '    .anx-input:focus {\n' +
      '      outline: none;\n' +
      '      border-color: #409eff;\n' +
      '      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);\n' +
      '    }\n' +
      '    .anx-button {\n' +
      '      padding: 10px 20px;\n' +
      '      background-color: #409eff;\n' +
      '      color: white;\n' +
      '      border: none;\n' +
      '      border-radius: 4px;\n' +
      '      cursor: pointer;\n' +
      '      transition: background-color 0.3s ease;\n' +
      '    }\n' +
      '    .anx-button:hover {\n' +
      '      background-color: #66b1ff;\n' +
      '    }\n' +
      '    .anx-error {\n' +
      '      color: #f56c6c;\n' +
      '      background-color: #fef0f0;\n' +
      '      border: 1px solid #fbc4c4;\n' +
      '      padding: 12px;\n' +
      '      border-radius: 4px;\n' +
      '      margin: 12px 0;\n' +
      '    }\n' +
      '    .product {\n' +
      '      border: 1px solid #ebeef5;\n' +
      '      padding: 16px;\n' +
      '      margin: 12px 0;\n' +
      '      border-radius: 8px;\n' +
      '      background-color: #ffffff;\n' +
      '      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n' +
      '    }\n' +
      '    .product h2 {\n' +
      '      margin-top: 0;\n' +
      '      font-size: 18px;\n' +
      '      color: #303133;\n' +
      '    }\n' +
      '    .price {\n' +
      '      color: #f56c6c;\n' +
      '      font-weight: bold;\n' +
      '      font-size: 16px;\n' +
      '    }\n' +
      '  </style>\n' +
      '  <script type="module" src="../dist/anx-element.mjs"></script>\n' +
      '</head>\n' +
      '<body>\n' +
      navHTML +
      '  <div class="container">\n' +
      '    <div class="editor">\n' +
      '      <div class="editor-header">\n' +
      '        <h1>Markdown Editor</h1>\n' +
      '      </div>\n' +
      '      <textarea id="editor">' + demoMarkdown + '</textarea>\n' +
      '    </div>\n' +
      '    <div class="preview">\n' +
      '      <div class="preview-header">\n' +
      '        <h1>Preview</h1>\n' +
      '      </div>\n' +
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