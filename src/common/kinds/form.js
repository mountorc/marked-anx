// 处理form类型的组件
import { renderComponent } from '../renderers.js';

/**
 * 渲染form类型的组件
 * @param {Object} component - 组件配置
 * @returns {string} - 渲染后的HTML
 */
export function renderForm(component) {
  const { title, kinds = [], action, submitText = 'Submit' } = component;
  
  let formHTML = '';
  
  // 渲染标题
  if (title) {
    formHTML += `<h3 class="anx-form-title">${title}</h3>`;
  }
  
  // 渲染form items
  formHTML += `<form class="anx-form">`;
  
  kinds.forEach((item, index) => {
    formHTML += `<div class="anx-form-item">`;
    
    // 渲染标签
    if (item.title) {
      formHTML += `<label class="anx-form-label">${item.title}${item.must ? ' *' : ''}</label>`;
    }
    
    // 渲染组件
    formHTML += `<div class="anx-form-content">${renderComponent(item)}</div>`;
    
    // 渲染描述
    if (item.description) {
      formHTML += `<div class="anx-form-description">${item.description}</div>`;
    }
    
    formHTML += `</div>`;
  });
  
  // 渲染提交按钮
  formHTML += `<div class="anx-form-actions">
    <button type="submit" class="anx-button">${submitText}</button>
  </div>`;
  
  formHTML += `</form>`;
  
  return formHTML;
}