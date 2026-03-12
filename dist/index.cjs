// 导出marked插件
import markedAnx from './plugin/index.js';

// 只在浏览器环境中导入anx自定义元素
if (typeof window !== 'undefined' && window.document) {
  import('./component/anx-element.js');
}

export default markedAnx;
export { markedAnx };