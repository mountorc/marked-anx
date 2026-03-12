import { marked } from 'marked';
import markedAnx from './dist/index.mjs';
import fs from 'fs/promises';

// 加载 marked-anx 插件
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// 应用插件
marked.use({
  renderer,
  extensions
});

// 测试 markdown 内容中的 <anx> 标签
async function testAnx() {
  try {
    // 测试纯 markdown 内容中的 <anx> 标签
    const markdownContent = `
测试anx

<anx>{"kind":"text","value":"anxtest"}</anx>
`;
    console.log('Original markdown content:');
    console.log(markdownContent);
    console.log('\nRendered content:');
    
    // 渲染内容
    const renderedContent = marked(markdownContent);
    console.log(renderedContent);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAnx();