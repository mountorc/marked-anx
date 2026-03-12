

function markedAnx() {
  
  const getPropertyValue = (obj, path) => {
    if (!obj || typeof obj !== 'object') return undefined;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value[key] === undefined) {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  };
  
  const parseTemplate = (templateContent, data) => {
    if (!templateContent) return '';
    
    let parsedTemplate = templateContent;
    
    const doubleBracesRegex = /\{\{([^{}]+)\}\}/g;
    parsedTemplate = parsedTemplate.replace(doubleBracesRegex, (match, variable) => {
      const value = getPropertyValue(data, variable.trim());
      return value !== undefined ? value : match;
    });
    
    const dollarBracesRegex = /\$\{([^{}]+)\}/g;
    parsedTemplate = parsedTemplate.replace(dollarBracesRegex, (match, variable) => {
      const value = getPropertyValue(data, variable.trim());
      return value !== undefined ? value : match;
    });
    
    const singleBracesRegex = /\{([^{}]+)\}/g;
    parsedTemplate = parsedTemplate.replace(singleBracesRegex, (match, variable) => {
      const value = getPropertyValue(data, variable.trim());
      return value !== undefined ? value : match;
    });
    
    return parsedTemplate;
  };
  
  const renderComponent = (component) => {
    if (!component || !component.kind) {
      return '<div class="anx-error">Invalid component</div>';
    }
    
    switch (component.kind) {
      case 'box':
        return renderBox(component);
      case 'board':
        return renderBoard(component);
      case 'text':
        return renderText(component);
      case 'input':
        return renderInput(component);
      case 'button':
        return renderButton(component);
      default:
        return `<div class="anx-component anx-${component.kind}">${JSON.stringify(component)}</div>`;
    }
  };
  
  const renderBox = (component) => {
    const title = component.title || '';
    const data = component.data || [];
    const html = component.html || '';
    const template = component.template || '';
    
    let content = '';
    if (data.length > 0) {
      data.forEach((item, index) => {
        const templateContent = template || html;
        if (templateContent) {
          content += `<div class="anx-box-item">${parseTemplate(templateContent, item)}</div>`;
        }
      });
    } else {
      const templateContent = template || html;
      if (templateContent) {
        content = parseTemplate(templateContent, component);
      }
    }
    
    return `
      <div class="anx-box">
        ${title ? `<div class="anx-box-title">${title}</div>` : ''}
        <div class="anx-box-content">${content}</div>
      </div>
    `;
  };
  
  const renderBoard = (component) => {
    const kinds = component.kinds || [];
    let content = '';
    
    kinds.forEach((subComponent) => {
      content += renderComponent(subComponent);
    });
    
    return `<div class="anx-board">${content}</div>`;
  };
  
  const renderText = (component) => {
    const value = component.value || '';
    return `<div class="anx-text">${value}</div>`;
  };
  
  const renderInput = (component) => {
    const placeholder = component.placeholder || '';
    const value = component.value || '';
    const nick = component.nick || '';
    
    return `
      <div class="anx-input-wrapper">
        <input type="text" class="anx-input" placeholder="${placeholder}" value="${value}" ${nick ? `name="${nick}"` : ''}>
      </div>
    `;
  };
  
  const renderButton = (component) => {
    const label = component.label || 'Button';
    const action = component.action || '';
    
    return `
      <button class="anx-button" ${action ? `data-action="${action}"` : ''}>
        ${label}
      </button>
    `;
  };

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