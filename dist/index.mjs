import marked from "marked";

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

  // Override the code renderer
  const renderer = new marked.Renderer();
  const originalCode = renderer.code;
  
  renderer.code = function(code, infostring, escaped) {
    if (infostring === 'anx') {
      try {
        const component = JSON.parse(code);
        return `<div class="anx-container">${renderComponent(component)}</div>`;
      } catch (error) {
        return `<div class="anx-container anx-error">Invalid JSON: ${error.message}</div>`;
      }
    }
    return originalCode.call(this, code, infostring, escaped);
  };

  return { renderer };
}

export default markedAnx;