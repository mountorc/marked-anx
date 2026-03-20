// 定义自定义元素 marked-anx
class MarkedAnx extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['markdown', 'src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'markdown' || name === 'src') {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    try {
      // 加载依赖
      const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@14.1.1/+esm');
      const { default: markedAnxComponent } = await import('../dist/marked-anx-component.mjs');
      
      // 初始化ANX组件插件
      const anxComponentPlugin = markedAnxComponent();
      const { renderer, extensions } = anxComponentPlugin(marked);
      
      // 获取Markdown内容
      let markdownContent;
      if (this.hasAttribute('src')) {
        // 从URL获取
        const response = await fetch(this.getAttribute('src'));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        markdownContent = await response.text();
      } else if (this.hasAttribute('markdown')) {
        // 从属性获取
        markdownContent = this.getAttribute('markdown');
      } else if (this.textContent && this.textContent.trim()) {
        // 从标签内部获取
        markdownContent = this.textContent.trim();
      } else {
        // 默认内容
        markdownContent = '# Marked ANX Component\n\nNo content provided.';
      }
      
      console.log('Markdown content:', markdownContent);
      
      // 处理ANX块
      const html = this.processAnxBlocks(markdownContent, marked, renderer, extensions);
      
      console.log('Rendered HTML:', html);
      
      // 渲染内容
      this.shadowRoot.innerHTML = `
        <style>
          /* 全局样式 */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          /* 基础样式 */
          :host {
            display: block;
            width: 100%;
          }
          
          .marked-anx-content {
            width: 100%;
          }
          
          /* 标题样式 */
          h1, h2, h3, h4, h5, h6 {
            color: #303133;
            margin-bottom: 16px;
            font-weight: 600;
          }
          h1 {
            font-size: 24px;
          }
          h2 {
            font-size: 20px;
          }
          h3 {
            font-size: 18px;
          }
          
          /* 段落样式 */
          p {
            margin-bottom: 16px;
            line-height: 1.6;
            color: #303133;
          }
          
          /* 列表样式 */
          ul, ol {
            margin-bottom: 16px;
            padding-left: 24px;
          }
          li {
            margin-bottom: 8px;
          }
          
          /* 代码样式 */
          code {
            background-color: #f0f2f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
          }
          pre {
            background-color: #f0f2f5;
            padding: 16px;
            border-radius: 4px;
            overflow-x: auto;
            margin-bottom: 16px;
          }
          pre code {
            background-color: transparent;
            padding: 0;
          }
          
          /* ANX组件样式 */
          .anx-container {
            border: 1px solid #e4e7ed;
            padding: 20px;
            margin: 20px 0;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .anx-box {
            border: 1px solid #e4e7ed;
            border-radius: 8px;
            margin: 16px 0;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          .anx-box-title {
            background-color: #f5f7fa;
            padding: 12px 16px;
            font-weight: 600;
            border-bottom: 1px solid #e4e7ed;
            color: #303133;
          }
          .anx-box-content {
            padding: 16px;
          }
          .anx-box-item {
            border: 1px solid #ebeef5;
            padding: 12px;
            margin: 8px 0;
            border-radius: 4px;
            background-color: #ffffff;
          }
          .anx-board {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }
          .anx-text {
            padding: 12px;
            color: #303133;
          }
          .anx-input-wrapper {
            margin: 12px 0;
          }
          .anx-input {
            padding: 10px 14px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.3s ease;
          }
          .anx-input:focus {
            outline: none;
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          }
          .anx-button {
            padding: 10px 20px;
            background-color: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .anx-button:hover {
            background-color: #66b1ff;
          }
          .anx-error {
            color: #f56c6c;
            background-color: #fef0f0;
            border: 1px solid #fbc4c4;
            padding: 12px;
            border-radius: 4px;
            margin: 12px 0;
          }
          .product {
            border: 1px solid #ebeef5;
            padding: 16px;
            margin: 12px 0;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          .product h2 {
            margin-top: 0;
            font-size: 18px;
            color: #303133;
          }
          .price {
            color: #f56c6c;
            font-weight: bold;
            font-size: 16px;
          }
          
          /* Options组件样式 */
          .anx-options-wrapper {
            margin: 12px 0;
          }
          .anx-radio-item {
            margin-bottom: 8px;
          }
          .anx-radio-item input[type="radio"] {
            margin-right: 8px;
          }
          
          /* Checkbox组件样式 */
          .anx-checkbox-wrapper {
            margin: 12px 0;
          }
          .anx-checkbox-item {
            margin-bottom: 8px;
          }
          .anx-checkbox-item input[type="checkbox"] {
            margin-right: 8px;
          }
          
          /* Date组件样式 */
          .anx-input[type="date"] {
            width: 100%;
          }
          
          /* Textarea组件样式 */
          .anx-input[type="textarea"],
          textarea.anx-input {
            width: 100%;
            resize: vertical;
            font-family: inherit;
          }
        </style>
        <div class="marked-anx-content">${html}</div>
      `;
    } catch (error) {
      console.error('Error rendering marked-anx:', error);
      this.shadowRoot.innerHTML = `
        <style>
          .anx-error {
            color: #f56c6c;
            background-color: #fef0f0;
            border: 1px solid #fbc4c4;
            padding: 12px;
            border-radius: 4px;
            margin: 12px 0;
          }
        </style>
        <div class="anx-error">Error: ${error.message}</div>
      `;
    }
  }

  processAnxBlocks(markdown, marked, renderer, extensions) {
    // 首先渲染Markdown
    let html = marked(markdown, {
      breaks: true,
      gfm: true,
      sanitize: false,
      renderer: renderer,
      extensions: extensions
    });
    
    // 处理:::anx语法块
    // 从原始markdown中提取anx块
    let anxBlocks = markdown.match(/:::anx[\s\S]*?:::/g);
    
    if (anxBlocks) {
      anxBlocks.forEach((block, index) => {
        try {
          // 移除anx块标记
          let jsonContent = block.replace(/:::anx[\s\n\r]+|[\s\n\r]+:::/g, '').trim();
          // 处理转义的引号
          jsonContent = jsonContent.replace(/\\"/g, '"');
          const component = JSON.parse(jsonContent);
          const renderedComponent = `<anx-render>${JSON.stringify(component)}</anx-render>`;
          
          // 渲染原始块以获取要替换的HTML
          const blockHtml = marked(block, {
            breaks: true,
            gfm: true,
            sanitize: false
          }).trim();
          
          // 替换HTML中的anx块
          html = html.replace(blockHtml, renderedComponent);
        } catch (error) {
          console.error('ANX plugin error:', error);
          const errorComponent = `<anx-render>{"kind": "text", "value": "Invalid JSON: ${error.message}"}</anx-render>`;
          const blockHtml = marked(block, {
            breaks: true,
            gfm: true,
            sanitize: false
          }).trim();
          html = html.replace(blockHtml, errorComponent);
        }
      });
    }
    
    return html;
  }

  // 方法：设置Markdown内容
  setMarkdown(markdown) {
    this.setAttribute('markdown', markdown);
  }

  // 方法：从URL加载Markdown
  loadFromUrl(url) {
    this.setAttribute('src', url);
  }
}

// 注册自定义元素
if (typeof customElements !== 'undefined') {
  if (!customElements.get('marked-anx')) {
    customElements.define('marked-anx', MarkedAnx);
    console.log('marked-anx custom element registered');
  } else {
    console.log('marked-anx custom element already registered');
  }
}

export default MarkedAnx;