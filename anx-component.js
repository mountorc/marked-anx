// 定义自定义元素 anx-component
class AnxComponentElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    try {
      // 解析标签内的 JSON 内容
      console.log("Element connected:", this);
      console.log("Element tag name:", this.tagName);
      
      // 等待一下，确保内容已经被解析
      setTimeout(() => {
        const content = this.textContent.trim();
        console.log("Content:", content);
        
        if (!content) {
          console.log("No content found");
          this.shadowRoot.innerHTML = `<div class="anx-error">No content found</div>`;
          return;
        }
        
        const component = JSON.parse(content);
        console.log("Parsed component:", component);
        
        // 根据组件类型渲染不同内容
        if (component.kind === 'text') {
          this.shadowRoot.innerHTML = `<div class="anx-text">${component.value}</div>`;
        } else {
          this.shadowRoot.innerHTML = `<div class="anx-component">${JSON.stringify(component)}</div>`;
        }
      }, 0);
    } catch (error) {
      console.error("Error:", error);
      this.shadowRoot.innerHTML = `<div class="anx-error">Invalid JSON: ${error.message}</div>`;
    }
  }
}

// 注册自定义元素
customElements.define('anx-render', AnxComponentElement);