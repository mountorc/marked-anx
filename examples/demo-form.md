# Test Form Component

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
