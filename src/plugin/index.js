

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
          return `<div class="anx-container">${renderComponent(component)}</div>`;
        } catch (error) {
          console.error('ANX plugin error:', error);
          return `<div class="anx-container anx-error">Invalid JSON: ${error.message}</div>`;
        }
      }
      return originalCode.call(this, code, infostring, escaped);
    };
    
    // 处理段落中的ANX语法
    renderer.paragraph = function(token) {
      let text = token.text || '';
      
      // 处理 {{anx}} 语法
      const anxMatch = text.match(/^\{\{anx\}\}(.*)\{\{anx\}\}$/s);
      if (anxMatch) {
        try {
          const component = JSON.parse(anxMatch[1]);
          return `<div class="anx-container">${renderComponent(component)}</div>`;
        } catch (error) {
          console.error('ANX plugin error in paragraph:', error);
        }
      }
      
      // 处理 <anx> 标签语法（更宽松的匹配，允许标签前后有空白）
      const anxTagMatch = text.match(/<anx>([\s\S]*?)<\/anx>/s);
      if (anxTagMatch) {
        try {
          const component = JSON.parse(anxTagMatch[1]);
          // 替换 <anx> 标签为渲染后的内容
          const renderedContent = `<div class="anx-container">${renderComponent(component)}</div>`;
          const remainingText = text.replace(/<anx>[\s\S]*?<\/anx>/s, '').trim();
          if (remainingText) {
            return `<p>${remainingText}${renderedContent}</p>`;
          } else {
            return renderedContent;
          }
        } catch (error) {
          console.error('ANX plugin error in <anx> tag:', error);
        }
      }
      
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
            return `<div class="anx-container">${renderComponent(component)}</div>`;
          } catch (error) {
            console.error('ANX plugin error in tokenizer:', error);
            return `<div class="anx-container anx-error">Invalid JSON: ${error.message}</div>`;
          }
        }
      },
      {
        name: 'anx-inline',
        level: 'inline',
        start: function(src) {
          return src.match(/<anx>/i)?.index;
        },
        tokenizer: function(src, tokens) {
          const match = src.match(/<anx>([\s\S]*?)<\/anx>/i);
          if (match) {
            return {
              type: 'anx-inline',
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
            return `<div class="anx-container">${renderComponent(component)}</div>`;
          } catch (error) {
            console.error('ANX plugin error in inline tokenizer:', error);
            return `<div class="anx-container anx-error">Invalid JSON: ${error.message}</div>`;
          }
        }
      }
    ];
    
    return { renderer, extensions };
  };
}

export default markedAnx;