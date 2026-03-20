// 组件渲染器
import { fetchDataset } from './utils/dataset.js';
import { renderNavigation } from './kinds/navigation.js';
import { addEventListeners } from './utils/trigger-and-tap.js';

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
    case 'textarea':
      return renderTextarea(component);
    case 'button':
      return renderButton(component);
    case 'form':
      return renderForm(component);
    case 'navigation':
      return renderNavigation(component);
    case 'date':
      return renderDate(component);
    case 'options':
      return renderOptions(component);
    case 'checkbox':
      return renderCheckbox(component);
    default:
      return `<div class="anx-component anx-${component.kind}">${JSON.stringify(component)}</div>`;
  }
}

/**
 * 异步渲染组件，支持dataset配置
 * @param {Object} component - 组件配置
 * @returns {Promise<string>} - 渲染后的HTML
 */
export async function renderComponentAsync(component) {
  if (!component || !component.kind) {
    return '<div class="anx-error">Invalid component</div>';
  }
  
  // 检查是否有数据集配置
  if (component.dataset) {
    try {
      const datasetData = await fetchDataset(component.dataset);
      component.data = datasetData;
    } catch (error) {
      console.error('Error fetching dataset:', error);
    }
  }
  
  return renderComponent(component);
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
  const tapSet = component.tapSet || '';
  
  let content = '';
  if (data.length > 0) {
    data.forEach((item, index) => {
      const templateContent = template || html;
      if (templateContent) {
        const itemData = JSON.stringify(item).replace(/"/g, '&quot;');
        const tapAttrs = tapSet ? `data-tap-set="${tapSet}" data-item-data="${itemData}" style="cursor: pointer;"` : '';
        content += `<div class="anx-box-item" ${tapAttrs}>${parseTemplate(templateContent, item)}</div>`;
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
  const id = component.uuid || `text-${Math.random().toString(36).substr(2, 9)}`;
  return `<div class="anx-text" data-component-id="${id}" ${component.tapSet || component.triggerSet ? 'style="cursor: pointer;"' : ''}>${value}</div>`;
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

/**
 * 渲染Date组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderDate(component) {
  const placeholder = component.placeholder || '';
  const value = component.value || '';
  const nick = component.nick || '';
  
  return `
    <div class="anx-input-wrapper">
      <input type="date" class="anx-input" placeholder="${placeholder}" value="${value}" ${nick ? `name="${nick}"` : ''}>
    </div>
  `;
}

/**
 * 渲染Options组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderOptions(component) {
  const options = component.options || [];
  const value = component.value || '';
  const nick = component.nick || '';
  
  let optionsHTML = '';
  options.forEach((option, index) => {
    const isSelected = option.value === value;
    optionsHTML += `
      <div class="anx-radio-item">
        <input type="radio" id="${nick}_${index}" name="${nick}" value="${option.value}" ${isSelected ? 'checked' : ''}>
        <label for="${nick}_${index}">${option.title}</label>
      </div>
    `;
  });
  
  return `
    <div class="anx-options-wrapper">
      ${optionsHTML}
    </div>
  `;
}

/**
 * 渲染Checkbox组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderCheckbox(component) {
  const options = component.options || [];
  const value = component.value || [];
  const nick = component.nick || '';
  
  let checkboxesHTML = '';
  options.forEach((option, index) => {
    const isChecked = Array.isArray(value) && value.includes(option.value);
    checkboxesHTML += `
      <div class="anx-checkbox-item">
        <input type="checkbox" id="${nick}_${index}" name="${nick}" value="${option.value}" ${isChecked ? 'checked' : ''}>
        <label for="${nick}_${index}">${option.title}</label>
      </div>
    `;
  });
  
  return `
    <div class="anx-checkbox-wrapper">
      ${checkboxesHTML}
    </div>
  `;
}

/**
 * 渲染Textarea组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderTextarea(component) {
  const placeholder = component.placeholder || '';
  const value = component.value || '';
  const nick = component.nick || '';
  const rows = component.rows || 4;
  
  return `
    <div class="anx-input-wrapper">
      <textarea class="anx-input" placeholder="${placeholder}" rows="${rows}" ${nick ? `name="${nick}"` : ''}>${value}</textarea>
    </div>
  `;
}

// 导入其他渲染器
import { renderForm } from './kinds/form.js';
import { parseTemplate } from './common.js';