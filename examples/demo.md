# Test ANX Plugin

## Box Component

```anx
{
  "kind": "box",
  "title": "Welcome",
  "html": "<p>Hello, {{user.name}}!</p>"
}
```

## Box with Data

```anx
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
```

## Board Component

```anx
{
  "kind": "board",
  "kinds": [
    { "kind": "text", "value": "User Information" },
    { "kind": "input", "placeholder": "Please enter your name", "nick": "username" },
    { "kind": "input", "placeholder": "Please enter your email", "nick": "email" },
    { "kind": "button", "label": "Submit", "action": "submitForm" }
  ]
}
```

## Text Component

```anx
{
  "kind": "text",
  "value": "This is a text component"
}
```

## Input Component

```anx
{
  "kind": "input",
  "placeholder": "Enter something",
  "value": "Initial value",
  "nick": "inputField"
}
```

## Button Component

```anx
{
  "kind": "button",
  "label": "Click Me",
  "action": "doSomething"
}
```

## Invalid JSON

```anx
{
  "kind": "box",
  "title": "Invalid JSON",
  "html": "This will cause an error"
}
```

Regular text here