// ANX component plugin for marked
// This plugin converts ANX syntax to <anx-render> elements for visual rendering

// Import anx-element.js to register the custom element only in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  import('../../dist/anx-element.mjs');
}

/**
 * ANX component plugin for marked
 * @returns {Function} - marked plugin function
 */
function markedAnxComponent() {
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
    
    // 直接在marked对象上添加扩展
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
    
    // 确保marked对象有extensions属性
    if (!marked.options) {
      marked.options = {};
    }
    if (!marked.options.extensions) {
      marked.options.extensions = [];
    }
    
    // 添加ANX扩展
    marked.options.extensions.push(...extensions);
    
    return { renderer, extensions };
  };
}

export default markedAnxComponent;
export { markedAnxComponent };