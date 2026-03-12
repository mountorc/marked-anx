// 共用函数

/**
 * 获取对象的属性值
 * @param {Object} obj - 目标对象
 * @param {string} path - 属性路径，如 "user.name"
 * @returns {*} - 属性值
 */
export const getPropertyValue = (obj, path) => {
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

/**
 * 解析模板，替换变量
 * @param {string} templateContent - 模板内容
 * @param {Object} data - 数据对象
 * @returns {string} - 解析后的模板
 */
export const parseTemplate = (templateContent, data) => {
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

/**
 * 渲染Box组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderBox = (component) => {
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

/**
 * 渲染Board组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderBoard = (component) => {
  const kinds = component.kinds || [];
  let content = '';
  
  kinds.forEach((subComponent) => {
    content += renderComponent(subComponent);
  });
  
  return `<div class="anx-board">${content}</div>`;
};

/**
 * 渲染Text组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderText = (component) => {
  const value = component.value || '';
  return `<div class="anx-text">${value}</div>`;
};

/**
 * 渲染Input组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderInput = (component) => {
  const placeholder = component.placeholder || '';
  const value = component.value || '';
  const nick = component.nick || '';
  
  return `
    <div class="anx-input-wrapper">
      <input type="text" class="anx-input" placeholder="${placeholder}" value="${value}" ${nick ? `name="${nick}"` : ''}>
    </div>
  `;
};

/**
 * 渲染Button组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderButton = (component) => {
  const label = component.label || 'Button';
  const action = component.action || '';
  
  return `
    <button class="anx-button" ${action ? `data-action="${action}"` : ''}>
      ${label}
    </button>
  `;
};

/**
 * 渲染组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export const renderComponent = (component) => {
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