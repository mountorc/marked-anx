// 组件渲染器

/**
 * 渲染组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderComponent(component) {
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
    case 'form':
      return renderForm(component);
    default:
      return `<div class="anx-component anx-${component.kind}">${JSON.stringify(component)}</div>`;
  }
}

/**
 * 渲染Box组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderBox(component) {
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
}

/**
 * 渲染Board组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderBoard(component) {
  const kinds = component.kinds || [];
  let content = '';
  
  kinds.forEach((subComponent) => {
    content += renderComponent(subComponent);
  });
  
  return `<div class="anx-board">${content}</div>`;
}

/**
 * 渲染Text组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderText(component) {
  const value = component.value || '';
  return `<div class="anx-text">${value}</div>`;
}

/**
 * 渲染Input组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderInput(component) {
  const placeholder = component.placeholder || '';
  const value = component.value || '';
  const nick = component.nick || '';
  
  return `
    <div class="anx-input-wrapper">
      <input type="text" class="anx-input" placeholder="${placeholder}" value="${value}" ${nick ? `name="${nick}"` : ''}>
    </div>
  `;
}

/**
 * 渲染Button组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderButton(component) {
  const label = component.label || 'Button';
  const action = component.action || '';
  
  return `
    <button class="anx-button" ${action ? `data-action="${action}"` : ''}>
      ${label}
    </button>
  `;
}

// 导入其他渲染器
import { renderForm } from './kinds/form.js';
import { parseTemplate } from './common.js';