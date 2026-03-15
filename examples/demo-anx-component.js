// 可重用的 ANX 组件处理模块

/**
 * 从 Markdown 中提取并处理 ANX 块
 * @param {string} markdown - Markdown 内容
 * @param {Object} marked - marked 实例
 * @param {Object} renderer - 自定义渲染器
 * @param {Array} extensions - 扩展
 * @returns {string} - 处理后的 HTML
 */
export function processAnxBlocks(markdown, marked, renderer, extensions) {
  // 先渲染markdown，不处理anx块
  let markdownHtml = marked(markdown, {
    breaks: true,
    gfm: true,
    sanitize: false,
    renderer: renderer,
    extensions: extensions
  });
  
  // 处理anx块 - 使用更精确的方法
  let match;
  const anxBlockRegex = /:::anx[\r\n]+([\s\S]*?)[\r\n]+:::/g;
  
  while ((match = anxBlockRegex.exec(markdown)) !== null) {
    try {
      const fullBlock = match[0];
      const jsonContent = match[1].trim();
      const component = JSON.parse(jsonContent);
      // 生成anx-render标签
      const renderedComponent = `<anx-render>${JSON.stringify(component)}</anx-render>`;
      // 替换markdown渲染后的内容中的anx块
      const blockHtml = marked(fullBlock, {
        breaks: true,
        gfm: true,
        sanitize: false
      }).trim();
      markdownHtml = markdownHtml.replace(blockHtml, renderedComponent);
    } catch (error) {
      const errorComponent = `<anx-render>{"kind": "text", "value": "Invalid JSON: ${error.message}"}</anx-render>`;
      const fullBlock = match[0];
      const blockHtml = marked(fullBlock, {
        breaks: true,
        gfm: true,
        sanitize: false
      }).trim();
      markdownHtml = markdownHtml.replace(blockHtml, errorComponent);
    }
  }
  
  return markdownHtml;
}