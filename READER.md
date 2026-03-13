# marked-anx Plugin

## Project Background

The marked-anx plugin is an extension for the marked library that enables the rendering of ANX (AI Native Ex) components within markdown files. ANX is an Agent-friendly frontend coding format designed to establish a unified standard for frontend interactions, following the specification from [https://github.com/mountorc/anx-protocol](https://github.com/mountorc/anx-protocol).

### Key Features
- Support for ANX component syntax using ```anx``` code blocks
- JSON-based component configuration
- Dynamic rendering of various ANX component types
- Template parsing with variable substitution
- Error handling for invalid JSON

## Installation

```bash
npm install marked marked-anx
```

## Usage

### Using the Plugin

The marked-anx plugin can be used with marked's extension system. Here's how to integrate it:

#### Basic Usage

```javascript
import { marked } from 'marked';
import markedAnx from 'marked-anx';

// Initialize the plugin
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// Apply the plugin
marked.use({
  renderer: renderer,
  extensions: extensions
});

const markdown = `
# Test ANX Plugin

\`\`\`anx
{
  "kind": "box",
  "title": "Welcome",
  "html": "<p>Hello, {{user.name}}!</p>"
}
\`\`\`
`;

const html = marked(markdown);
console.log(html);
```

#### With HTML Sanitization

When using marked with HTML sanitization, you need to ensure that the ANX component output is not sanitized away. Here's how to handle it with DOMPurify:

```javascript
import { marked } from 'marked';
import markedAnx from 'marked-anx';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize the plugin
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// Apply the plugin
marked.use({
  renderer: renderer,
  extensions: extensions
});

const markdown = `
# Test ANX Plugin

\`\`\`anx
{
  "kind": "box",
  "title": "Welcome",
  "html": "<p>Hello, {{user.name}}!</p>"
}
\`\`\`
`;

// Render markdown to HTML
let html = marked(markdown);

// Sanitize HTML while preserving ANX components
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configure DOMPurify to allow anx-render elements and their content
DOMPurify.addHook('beforeSanitizeElements', function(currentNode) {
  // Allow anx-render elements
  return currentNode.tagName !== 'ANX-RENDER';
});

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if (node.tagName === 'ANX-RENDER') {
    // Preserve all attributes of anx-render elements
    return node;
  }
});

html = purify.sanitize(html);
console.log(html);
```

### Using the Component

The ANX component can be used directly in HTML without the marked plugin. Here's how:

#### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>ANX Component Test</title>
  <script type="module" src="path/to/marked-anx/src/component/anx-element.js"></script>
</head>
<body>
  <h1>ANX Component Test</h1>
  
  <anx-render>
    {
      "kind": "board",
      "kinds": [
        {"kind": "text", "value": "User Information"},
        {"kind": "input", "placeholder": "Please enter your name"},
        {"kind": "button", "label": "Submit"}
      ]
    }
  </anx-render>
</body>
</html>
```

#### With HTML Sanitization

When using the ANX component in environments with HTML sanitization, you need to ensure that the `anx-render` elements are not sanitized. Here's how to handle it with DOMPurify in a browser environment:

```html
<!DOCTYPE html>
<html>
<head>
  <title>ANX Component Test with Sanitization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js"></script>
  <script type="module" src="path/to/marked-anx/src/component/anx-element.js"></script>
</head>
<body>
  <h1>ANX Component Test with Sanitization</h1>
  <div id="content"></div>
  
  <script>
    // Example ANX component HTML
    const anxHtml = `
      <anx-render>
        {
          "kind": "box",
          "title": "Welcome",
          "html": "<p>Hello, World!</p>"
        }
      </anx-render>
    `;
    
    // Sanitize HTML while preserving ANX components
    const sanitizedHtml = DOMPurify.sanitize(anxHtml, {
      ADD_TAGS: ['anx-render'],
      ADD_ATTR: ['*']
    });
    
    // Insert sanitized HTML
    document.getElementById('content').innerHTML = sanitizedHtml;
  </script>
</body>
</html>
```

### Supported Component Types

#### Box Component

```markdown
\`\`\`anx
{
  "kind": "box",
  "title": "Product List",
  "data": [
    { "name": "Product 1", "price": 100 },
    { "name": "Product 2", "price": 200 }
  ],
  "html": "<div><h2>{{name}}</h2><p>${{price}}</p></div>"
}
\`\`\`
```

#### Board Component

```markdown
\`\`\`anx
{
  "kind": "board",
  "kinds": [
    { "kind": "text", "value": "User Information" },
    { "kind": "input", "placeholder": "Enter your name" },
    { "kind": "button", "label": "Submit" }
  ]
}
\`\`\`
```

#### Text Component

```markdown
\`\`\`anx
{
  "kind": "text",
  "value": "This is a text component"
}
\`\`\`
```

#### Input Component

```markdown
\`\`\`anx
{
  "kind": "input",
  "placeholder": "Enter something",
  "value": "Initial value"
}
\`\`\`
```

#### Button Component

```markdown
\`\`\`anx
{
  "kind": "button",
  "label": "Click Me",
  "action": "doSomething"
}
\`\`\`
```

## Template Syntax

The plugin supports variable substitution in templates using the following syntax:
- `{{variable}}` - Double braces syntax
- `${{variable}}` - Dollar brace syntax
- `{variable}` - Single brace syntax

### Example

```markdown
\`\`\`anx
{
  "kind": "box",
  "title": "User Profile",
  "data": [
    { "name": "John", "age": 30, "email": "john@example.com" }
  ],
  "html": "<div><h2>{{name}}</h2><p>Age: {{age}}</p><p>Email: {{email}}</p></div>"
}
\`\`\`
```

## Testing

The project includes a unified demo server for previewing all ANX components:

1. Start the demo server:
   ```bash
   node examples/server.js
   ```

2. Open your browser and navigate to `http://localhost:4664`

3. You can access different demos:
   - `http://localhost:4664/plugin` - Uses marked-anx plugin directly (renders native components)
   - `http://localhost:4664/element` - Uses `<anx-render>` element directly
   - `http://localhost:4664/component` - Uses marked-anx component plugin with `<anx-render>` elements

4. Modify the `examples/demo.md` file to test different ANX components

5. Refresh the browser to see changes (no server restart required)

## Project Structure

```
marked-anx/
├── src/              # Source code
│   ├── plugin/       # Marked plugin implementation
│   │   └── index.js  # Main plugin code (renders native components)
│   ├── component/    # ANX component implementation
│   │   ├── anx-element.js  # Custom element code
│   │   └── index.js  # Marked plugin that uses <anx-render> elements
│   ├── common/       # Shared utility functions
│   │   └── common.js # Common rendering functions
│   └── index.js      # Main entry point
├── examples/         # Example files
│   ├── server.js     # Unified demo server (port 4664)
│   ├── demo-plugin.js # Plugin demo handler
│   ├── demo-component.js # Component demo handler
│   ├── demo-element.html # Element demo file
│   └── demo.md       # Demo markdown file
├── READER.md         # This documentation
├── package.json      # Project configuration
└── .gitignore        # Git ignore file
```

## API Reference

### Plugin Initialization

```javascript
const { marked } = require('marked');
const markedAnx = require('marked-anx');

const { renderer } = markedAnx();
marked.setOptions({
  renderer: renderer
});
```

### Component Rendering

The plugin automatically renders ANX components enclosed in ```anx``` code blocks:

```markdown
\`\`\`anx
{
  "kind": "component_type",
  "property1": "value1",
  "property2": "value2"
}
\`\`\`
```

## Troubleshooting

### Common Issues

1. **JSON Parse Error**
   - Ensure your JSON is valid
   - Check for missing commas between properties
   - Ensure all strings are properly quoted

2. **Template Not Rendering**
   - Check that your template syntax is correct
   - Ensure variables in templates match the data structure

3. **Component Not Displaying**
   - Verify the component type is supported
   - Check for typos in component properties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

---

# marked-anx 插件

## 项目背景

marked-anx 插件是 marked 库的扩展，用于在 markdown 文件中渲染 ANX（AI Native Ex）组件。ANX 是一种面向 Agent 的前端编码格式，旨在建立统一的前端交互标准，遵循 [https://github.com/mountorc/anx-protocol](https://github.com/mountorc/anx-protocol) 中的规范。

### 主要功能
- 支持使用 ```anx``` 代码块的 ANX 组件语法
- 基于 JSON 的组件配置
- 各种 ANX 组件类型的动态渲染
- 带变量替换的模板解析
- 无效 JSON 的错误处理

## 安装

```bash
npm install marked marked-anx
```

## 使用方法

### 使用插件

marked-anx 插件可以与 marked 的扩展系统一起使用。以下是如何集成它：

#### 基本使用

```javascript
import { marked } from 'marked';
import markedAnx from 'marked-anx';

// 初始化插件
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// 应用插件
marked.use({
  renderer: renderer,
  extensions: extensions
});

const markdown = `
# 测试 ANX 插件

\`\`\`anx
{
  "kind": "box",
  "title": "欢迎",
  "html": "<p>你好，{{user.name}}！</p>"
}
\`\`\`
`;

const html = marked(markdown);
console.log(html);
```

#### 带 HTML 净化

当使用带有 HTML 净化的 marked 时，需要确保 ANX 组件输出不会被净化掉。以下是使用 DOMPurify 处理的方法：

```javascript
import { marked } from 'marked';
import markedAnx from 'marked-anx';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// 初始化插件
const anxPlugin = markedAnx();
const { renderer, extensions } = anxPlugin(marked);

// 应用插件
marked.use({
  renderer: renderer,
  extensions: extensions
});

const markdown = `
# 测试 ANX 插件

\`\`\`anx
{
  "kind": "box",
  "title": "欢迎",
  "html": "<p>你好，{{user.name}}！</p>"
}
\`\`\`
`;

// 将 markdown 渲染为 HTML
let html = marked(markdown);

// 净化 HTML 同时保留 ANX 组件
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// 配置 DOMPurify 以允许 anx-render 元素及其内容
DOMPurify.addHook('beforeSanitizeElements', function(currentNode) {
  // 允许 anx-render 元素
  return currentNode.tagName !== 'ANX-RENDER';
});

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if (node.tagName === 'ANX-RENDER') {
    // 保留 anx-render 元素的所有属性
    return node;
  }
});

html = purify.sanitize(html);
console.log(html);
```

### 使用组件

ANX 组件可以在没有 marked 插件的情况下直接在 HTML 中使用。以下是使用方法：

#### 基本使用

```html
<!DOCTYPE html>
<html>
<head>
  <title>ANX 组件测试</title>
  <script type="module" src="path/to/marked-anx/src/component/anx-element.js"></script>
</head>
<body>
  <h1>ANX 组件测试</h1>
  
  <anx-render>
    {
      "kind": "board",
      "kinds": [
        {"kind": "text", "value": "用户信息"},
        {"kind": "input", "placeholder": "请输入姓名"},
        {"kind": "button", "label": "提交"}
      ]
    }
  </anx-render>
</body>
</html>
```

#### 带 HTML 净化

在有 HTML 净化的环境中使用 ANX 组件时，需要确保 `anx-render` 元素不会被净化。以下是在浏览器环境中使用 DOMPurify 处理的方法：

```html
<!DOCTYPE html>
<html>
<head>
  <title>带净化的 ANX 组件测试</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js"></script>
  <script type="module" src="path/to/marked-anx/src/component/anx-element.js"></script>
</head>
<body>
  <h1>带净化的 ANX 组件测试</h1>
  <div id="content"></div>
  
  <script>
    // 示例 ANX 组件 HTML
    const anxHtml = `
      <anx-render>
        {
          "kind": "box",
          "title": "欢迎",
          "html": "<p>你好，世界！</p>"
        }
      </anx-render>
    `;
    
    // 净化 HTML 同时保留 ANX 组件
    const sanitizedHtml = DOMPurify.sanitize(anxHtml, {
      ADD_TAGS: ['anx-render'],
      ADD_ATTR: ['*']
    });
    
    // 插入净化后的 HTML
    document.getElementById('content').innerHTML = sanitizedHtml;
  </script>
</body>
</html>
```

### 支持的组件类型

#### Box 组件

```markdown
\`\`\`anx
{
  "kind": "box",
  "title": "产品列表",
  "data": [
    { "name": "产品 1", "price": 100 },
    { "name": "产品 2", "price": 200 }
  ],
  "html": "<div><h2>{{name}}</h2><p>${{price}}</p></div>"
}
\`\`\`
```

#### Board 组件

```markdown
\`\`\`anx
{
  "kind": "board",
  "kinds": [
    { "kind": "text", "value": "用户信息" },
    { "kind": "input", "placeholder": "请输入姓名" },
    { "kind": "button", "label": "提交" }
  ]
}
\`\`\`
```

#### Text 组件

```markdown
\`\`\`anx
{
  "kind": "text",
  "value": "这是一个文本组件"
}
\`\`\`
```

#### Input 组件

```markdown
\`\`\`anx
{
  "kind": "input",
  "placeholder": "请输入内容",
  "value": "初始值"
}
\`\`\`
```

#### Button 组件

```markdown
\`\`\`anx
{
  "kind": "button",
  "label": "点击我",
  "action": "doSomething"
}
\`\`\`
```

## 模板语法

插件支持在模板中使用以下语法进行变量替换：
- `{{variable}}` - 双大括号语法
- `${{variable}}` - 美元大括号语法
- `{variable}` - 单大括号语法

## 测试

项目包含一个统一的演示服务器，用于预览所有 ANX 组件：

1. 启动演示服务器：
   ```bash
   node examples/server.js
   ```

2. 打开浏览器并导航到 `http://localhost:4664`

3. 你可以访问不同的演示：
   - `http://localhost:4664/plugin` - 直接使用 marked-anx 插件（渲染原生组件）
   - `http://localhost:4664/element` - 直接使用 `<anx-render>` 元素
   - `http://localhost:4664/component` - 使用带有 `<anx-render>` 元素的 marked-anx 组件插件

4. 修改 `examples/demo.md` 文件来测试不同的 ANX 组件

5. 刷新浏览器查看更改（无需重启服务器）

## 项目结构

```
marked-anx/
├── src/              # 源码
│   ├── plugin/       # Marked 插件实现
│   │   └── index.js  # 插件主代码（渲染原生组件）
│   ├── component/    # ANX 组件实现
│   │   ├── anx-element.js  # 自定义元素代码
│   │   └── index.js  # 使用 <anx-render> 元素的 Marked 插件
│   ├── common/       # 共享工具函数
│   │   └── common.js # 通用渲染函数
│   └── index.js      # 主入口点
├── examples/         # 示例文件
│   ├── server.js     # 统一演示服务器（端口 4664）
│   ├── demo-plugin.js # 插件演示处理程序
│   ├── demo-component.js # 组件演示处理程序
│   ├── demo-element.html # 元素演示文件
│   └── demo.md       # 演示 markdown 文件
├── READER.md         # 本文档
├── package.json      # 项目配置
└── .gitignore        # Git 忽略文件
```

## 许可证

MIT 许可证