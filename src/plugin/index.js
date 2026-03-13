

import { renderComponent } from '../common/common.js';

function markedAnx() {

  return function(marked) {
    // 动态检测marked对象和Renderer
    let Renderer = marked.Renderer;
    if (!Renderer && marked.default && marked.default.Renderer) {
      Renderer = marked.default.Renderer;
    }
    if (!Renderer && typeof marked === "function" && marked.Renderer) {
      Renderer = marked.Renderer;
    }
    if (!Renderer && window && window.marked && window.marked.Renderer) {
      Renderer = window.marked.Renderer;
    }
    
    if (!Renderer) {
      throw new Error("Could not find marked Renderer");
    }
    
    // 创建renderer并覆盖方法
    const renderer = new Renderer();
    const originalCode = renderer.code;
    const originalParagraph = renderer.paragraph;
    
    // 处理代码块中的ANX语法
    renderer.code = function(code, infostring, escaped) {
      if (infostring === 'anx') {
        try {
          let component;
          if (typeof code === 'object') {
            component = code;
          } else {
            component = JSON.parse(code);
          }
          return `<anx-render>${JSON.stringify(component)}</anx-render>`;
        } catch (error) {
          console.error('ANX plugin error:', error);
          return `<anx-render>{"kind": "text", "value": "Invalid JSON: ${error.message}"}</anx-render>`;
        }
      }
      return originalCode.call(this, code, infostring, escaped);
    };
    
    // 处理段落中的ANX语法
    renderer.paragraph = function(token) {
      let text = token.text || '';
      return originalParagraph ? originalParagraph.call(this, token) : `<p>${text}</p>`;
    };
    
    // 添加tokenizer支持
    const extensions = [
      {
        name: 'anx',
        level: 'block',
        start: function(src) {
          return src.match(/^:::anx\s*$/m)?.index;
        },
        tokenizer: function(src, tokens) {
          const match = src.match(/^:::anx\s*\n([\s\S]*?)\s*:::$/m);
          if (match) {
            return {
              type: 'anx',
              raw: match[0],
              content: match[1],
              tokens: []
            };
          }
          return false;
        },
        renderer: function(token) {
          try {
            const component = JSON.parse(token.content);
            return `<anx-render>${JSON.stringify(component)}</anx-render>`;
          } catch (error) {
            console.error('ANX plugin error in tokenizer:', error);
            return `<anx-render>{"kind": "text", "value": "Invalid JSON: ${error.message}"}</anx-render>`;
          }
        }
      }
    ];
    
    return { renderer, extensions };
  };
}

export default markedAnx;