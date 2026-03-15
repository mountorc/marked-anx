// 定义自定义元素 anx-component
import { renderComponent } from '../common/common.js';
import { fetchDataset } from '../common/dataset.js';
import { renderNavigation } from '../common/kinds/navigation.js';

// 只在浏览器环境中定义自定义元素
if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof HTMLElement !== 'undefined') {
  class AnxComponentElement extends HTMLElement {
    constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['src', 'markdown', 'auto-set', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' || name === 'markdown' || name === 'auto-set' || name === 'value') {
      this.connectedCallback();
    }
  }

  async connectedCallback() {
      try {
        // 解析标签内的 JSON 内容
        console.log("Element connected:", this);
        console.log("Element tag name:", this.tagName);
        
        let content;
        
        // 检查是否有 src 属性
        if (this.hasAttribute('src')) {
          const src = this.getAttribute('src');
          console.log("Fetching content from src:", src);
          
          try {
            const response = await fetch(src);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            content = await response.text();
            console.log("Fetched content:", content);
          } catch (fetchError) {
            console.error("Error fetching content:", fetchError);
            this.shadowRoot.innerHTML = `
              <style>
                .anx-error {
                  color: #f56c6c;
                  background-color: #fef0f0;
                  border: 1px solid #fbc4c4;
                  padding: 12px;
                  border-radius: 4px;
                  font-size: 14px;
                }
              </style>
              <div class="anx-error">Error fetching content: ${fetchError.message}</div>
            `;
            return;
          }
        } else if (this.hasAttribute('markdown')) {
          // 从 markdown 属性获取
          content = this.getAttribute('markdown');
          console.log("Content from markdown attribute:", content);
        } else {
          // 从标签内部获取
          content = this.textContent.trim();
          console.log("Content length:", content.length);
          console.log("Content starts with:", content.substring(0, 50) + '...');
          console.log("Content:", content);
        }
        
        if (!content) {
          console.log("No content found");
          this.shadowRoot.innerHTML = `
            <style>
              .anx-error {
                color: #f56c6c;
                background-color: #fef0f0;
                border: 1px solid #fbc4c4;
                padding: 12px;
                border-radius: 4px;
                font-size: 14px;
              }
            </style>
            <div class="anx-error">No content found</div>
          `;
          return;
        }
        
        // 尝试解析JSON，处理包含{{}}变量的情况
        let component;
        try {
          component = JSON.parse(content);
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
          // 尝试修复JSON格式，处理{{}}变量
          try {
            // 暂时替换{{}}变量为占位符，解析完成后再恢复
            const placeholderContent = content.replace(/\{\{([^{}]+)\}\}/g, "__ANX_VAR_$1__");
            component = JSON.parse(placeholderContent);
            // 恢复变量
            const restoreVariables = (obj) => {
              if (typeof obj === 'string') {
                return obj.replace(/__ANX_VAR_([^_]+)__/g, "{{$1}}");
              } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    obj[key] = restoreVariables(obj[key]);
                  }
                }
              }
              return obj;
            };
            component = restoreVariables(component);
          } catch (fixError) {
            console.error("Failed to fix JSON:", fixError);
            throw fixError;
          }
        }
        
        // 检查是否有auto-set属性
        let autoSet = null;
        if (this.hasAttribute('auto-set')) {
          try {
            autoSet = JSON.parse(this.getAttribute('auto-set'));
            console.log("Auto-set config:", autoSet);
          } catch (autoSetError) {
            console.error("Error parsing auto-set attribute:", autoSetError);
          }
        }
        
        // 检查是否有value属性
        if (this.hasAttribute('value')) {
          const value = this.getAttribute('value');
          console.log("Value attribute:", value);
          // 将value属性传递给组件
          component.value = value;
        }
        
        // 检查是否是 {config:{kind:"navigation",items:[]}} 格式
        if (component.config && component.config.kind) {
          component = component.config;
          // 将auto-set配置合并到第一层kind组件中
          if (autoSet) {
            Object.assign(component, autoSet);
          }
          // 传递value属性
          if (this.hasAttribute('value')) {
            component.value = this.getAttribute('value');
          }
        } else {
          // 如果不是config格式，直接合并auto-set配置
          if (autoSet) {
            Object.assign(component, autoSet);
          }
          // 传递value属性
          if (this.hasAttribute('value')) {
            component.value = this.getAttribute('value');
          }
        }
        
        console.log("Parsed component:", component);
        
        // 检查是否有数据集配置
        if (component.dataset) {
          console.log("Fetching dataset...");
          const datasetData = await fetchDataset(component.dataset);
          console.log("Dataset data:", datasetData);
          // 将数据集数据添加到组件配置中
          component.data = datasetData;
        }
        
        // 渲染组件
        const renderedContent = renderComponent(component);
        this.shadowRoot.innerHTML = `
          <style>
            /* 基础样式重置 */
            * {
              box-sizing: border-box;
            }
            
            /* 容器样式 - 移除外边框 */
            .anx-container {
              padding: 0;
              margin: 0;
              background-color: transparent;
              border-radius: 0;
              box-shadow: none;
            }
            
            /* 盒子样式 */
            .anx-box {
              border: 1px solid #e8e8e8;
              border-radius: 8px;
              margin: 10px 0;
              overflow: hidden;
              background-color: white;
            }
            
            .anx-box-title {
              background-color: #f0f0f0;
              padding: 12px 15px;
              font-weight: bold;
              border-bottom: 1px solid #e8e8e8;
              font-size: 16px;
              color: #333;
            }
            
            .anx-box-content {
              padding: 15px;
            }
            
            .anx-box-item {
              border: 1px solid #e0e0e0;
              padding: 12px;
              margin: 8px 0;
              border-radius: 4px;
              background-color: #fff;
              transition: all 0.2s ease;
            }
            
            .anx-box-item:hover {
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              border-color: #409eff;
            }
            
            /* 面板样式 */
            .anx-board {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 15px;
              background-color: white;
              border-radius: 4px;
              border: 1px solid #e8e8e8;
            }
            
            /* 文本样式 */
            .anx-text {
              padding: 12px;
              color: #333;
              font-size: 14px;
              line-height: 1.5;
            }
            
            /* 输入框样式 */
            .anx-input-wrapper {
              margin: 10px 0;
            }
            
            .anx-input {
              padding: 10px 12px;
              border: 1px solid #ddd;
              border-radius: 4px;
              width: 100%;
              font-size: 14px;
              transition: border-color 0.2s ease;
            }
            
            .anx-input:focus {
              outline: none;
              border-color: #409eff;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
            }
            
            /* 按钮样式 */
            .anx-button {
              padding: 10px 16px;
              background-color: #409eff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: background-color 0.2s ease;
            }
            
            .anx-button:hover {
              background-color: #66b1ff;
            }
            
            .anx-button:active {
              background-color: #3a8ee6;
            }
            
            /* 错误样式 */
            .anx-error {
              color: #f56c6c;
              background-color: #fef0f0;
              border: 1px solid #fbc4c4;
              padding: 12px;
              border-radius: 4px;
              font-size: 14px;
            }
            
            /* 产品样式 */
            .product {
              border: 1px solid #e0e0e0;
              padding: 15px;
              margin: 8px 0;
              border-radius: 4px;
              background-color: white;
              transition: all 0.2s ease;
            }
            
            .product:hover {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .product h2 {
              margin-top: 0;
              font-size: 18px;
              color: #333;
              margin-bottom: 8px;
            }
            
            .price {
              color: #f56c6c;
              font-weight: bold;
              font-size: 16px;
            }
            
            /* 表单样式 */
            .anx-form {
              display: flex;
              flex-direction: column;
              gap: 16px;
              padding: 15px;
              background-color: white;
              border-radius: 4px;
              border: 1px solid #e8e8e8;
            }
            
            .anx-form-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin: 0 0 10px 0;
            }
            
            .anx-form-item {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .anx-form-label {
              font-size: 14px;
              font-weight: 500;
              color: #333;
            }
            
            .anx-form-content {
              width: 100%;
            }
            
            .anx-form-description {
              font-size: 12px;
              color: #999;
              margin-top: 4px;
            }
            
            .anx-form-actions {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }
          </style>
          <div class="anx-container">${renderedContent}</div>
        `;
      } catch (error) {
        console.error("Error:", error);
        this.shadowRoot.innerHTML = `
          <style>
            .anx-error {
              color: #f56c6c;
              background-color: #fef0f0;
              border: 1px solid #fbc4c4;
              padding: 12px;
              border-radius: 4px;
              font-size: 14px;
            }
          </style>
          <div class="anx-error">Invalid JSON: ${error.message}</div>
        `;
      }
    }
  }

  // 注册自定义元素，只在浏览器环境中执行
  if (typeof customElements !== 'undefined') {
    if (!customElements.get('anx-render')) {
      customElements.define('anx-render', AnxComponentElement);
      console.log('anx-render custom element registered');
    } else {
      console.log('anx-render custom element already registered');
    }
  }
}

