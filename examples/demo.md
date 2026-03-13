# Test ANX Plugin

## Box Component

:::anx
{
  "kind": "box",
  "title": "Welcome",
  "html": "<p>Hello, {{user.name}}!</p>"
}
:::

## Box with Data

:::anx
{
  "kind": "box",
  "title": "Product List",
  "data": [
    { "name": "Product 1", "price": 100 },
    { "name": "Product 2", "price": 28000 },
    { "name": "Product 3", "price": 300 }
  ],
  "html": "<div class='product'><h2>{{name}}</h2><p class='price'>${{price}}</p></div>"
}
:::

## Board Component

:::anx
{
  "kind": "board",
  "kinds": [
    { "kind": "text", "value": "User Information" },
    { "kind": "input", "placeholder": "Please enter your name", "nick": "username" },
    { "kind": "input", "placeholder": "Please enter your email", "nick": "email" },
    { "kind": "button", "label": "Submit", "action": "submitForm" }
  ]
}
:::

## Text Component

:::anx
{
  "kind": "text",
  "value": "This is a text component"
}
:::

## Input Component

:::anx
{
  "kind": "input",
  "placeholder": "Enter something",
  "value": "Initial value",
  "nick": "inputField"
}
:::

## Button Component

:::anx
{
  "kind": "button",
  "label": "Click Me",
  "action": "doSomething"
}
:::

## Form Component

:::anx
{
  "kind": "form",
  "title": "User Registration",
  "kinds": [
    {
      "kind": "input",
      "type": "string",
      "nick": "username",
      "title": "Username",
      "defaultValue": "",
      "must": true,
      "placeholder": "请输入用户名",
      "minLength": 3,
      "maxLength": 20,
      "description": "用户的登录名称"
    },
    {
      "kind": "input",
      "type": "number",
      "nick": "age",
      "title": "Age",
      "defaultValue": 18,
      "must": true,
      "placeholder": "请输入年龄",
      "description": "用户的年龄"
    },
    {
      "kind": "input",
      "type": "string",
      "nick": "email",
      "title": "Email",
      "defaultValue": "",
      "must": true,
      "placeholder": "请输入邮箱",
      "description": "用户的邮箱地址"
    },
    {
      "kind": "button",
      "label": "Submit",
      "action": "submitForm"
    }
  ],
  "action": "/submit-form",
  "submitText": "Register"
}
:::

## Invalid JSON

:::anx
{
  "kind": "box",
  "title": "Invalid JSON",
  "html": "This will cause an error"
}
:::

Regular text here