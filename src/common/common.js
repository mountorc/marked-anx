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

// 导出渲染组件函数
export { renderComponent } from './renderers.js';