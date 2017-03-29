# JSX in depth

本质上来讲，JSX 仅仅是 `React.createElement(component, props, ...children)` 函数的语法糖，所有的 JSX 代码都将被转译成 `React.createElement()` 函数的调用。

```
  <MyButton color="blue" shadowSize={2}>
    Click Me
  </MyButton>
```

将被转译为：

```
  React.createElement(
    MyButton,
    {color: 'blue', shadowSize: 2},
    'Click Me'
  );
```

如果没有子元素，我们也可以使用自闭标签来书写 JSX 标签，如下：

```
  <div className="sidebar" />
```

将被转译为:

```
  React.createElement(
    'div',
    {className: 'sidebar'},
    null
  );
```

# Specifying The React Element Type

JSX 标签的第一部分决定了 React Element 的类型。

```
  <MyButton>Click Me</MyButton>
```

其中 `MyButton` 决定了这是一个自定义的 React Component.

首字母大写的标签表明了这是一个 React Component, 它将会被直接转译为以该标签名命名的变量。`<Foo />` 将会转译为 `Foo` 变量，让后传递给 `React.createElement(Foo, null);`.

### React Must Be in Scope

由于 JSX 会被转译为调用 `React.createElement`，所以 React 库必须在 JSX 代码所在的作用域中。

如下代码，虽然从外部导入的变量 `React` 和 `CustomButton` 并没有在 JS 代码中直接引用，但是这两个模块是必须被导入的。
 
```
  import React from 'react';
  import CustomButton from './CustomButton';
  
  function WarningButton(){
    return <CustomButton color="red" />
  }
```

如果你并没有使用 Javascript bundler， 而是通过 script 标签引入了 React 脚本，那么 React 将作为全局变量存在于各级作用域中。

### Using Dot Notation for JSX Type

我们也可以通过 `.` 运算符来在 JSX 中引用 React Component. 如果你有一个导出多个组件的单独模块，这种方式将是非常方便的。

例如：如果 `MyComponents.DatePicker` 是一个 React Component， 那么我们可以像如下代码在 JSX 中使用。

```
  import React from 'react';
  
  const MyComponents = {
    DatePicker: function(props){
      return <div>Imagine a {props.color} DatePicker here.</div>;
    }
  };
  
  function BuleDatePicker(){
    return <MyComponents.DatePicker color='blue' />;
  }
```

最终会被转译为：

```
  React.createElement(
    MyComponents.DatePicker,
    {color: 'red'},
    null
  );
```

> Note: MyComponents 变量并不需要首字符大写，这种方式的 React Element 依然可以正确的转译为对应的变量。

```
  const myComponents = {
    DatePicker: function(){...}
  }
  
  function BuleDatePicker(){
    return <myComponents.DatePicer color='blue'/>
  }
```

转译后为：

```
  React.createElement(
    myComponents.DatePicker,
    {color: 'red'},
    null
  );
```

### User-Defined Components Must Be Capitalized

当 React 元素的标签都是小写的，那么 React 转译器会将它识别为 React 内置的 component, 就像是 `<div>` 或者 `<span>` 会转译为字符串 `'div'` 或者 `'span'` 传递给 `React.createElement`.如果是以大写字符开始的，比如 `<Foo />` 会被转译为 `React.createElement(Foo)`, `Foo` 将对一个当前作用域中的一个组件（定义在当前作用域中的，或者是从外部文件导入的）。

React 建议使用首字母大写的标识来定义组件，如果你确实有一些小写字母开头的组件，那么在 JSX 中使用前，把它赋值给一个首字符大写的变量，否则将会被识别为内部组件，无法正常工作。

比如，如下代码将无法正常运行：

```
  import React from 'react';
  
  function hello(props){
    return <div>Hello, {props.name}</div>
  }
  
  function HelloWorld(){
    return <hello name='world' />
  }
```

`HelloWorld` 将会转译为：

```
  React.createElement(
    'hello',
    {name: 'world'}
  );
```

很显然，React 内部并没有一个 'hello' 的组件。

我们可以做如下修改来是上面的代码正常工作：

```
  const Hello = hello;
  
  function HelloWorld(){
    return <Hello name='world' />
  }
```

### Choosing the Type at Runtime

我们不可以使用一个通用的 js 表达式作为 React Element 的类型或者说作为 React 的标签。如果你确实想使用一个表达式来作为一个 JSX 的标签，首先把这个表达式的结果赋值给一个首字母大写的变量，然后使用这个变量作为 React Element 的标签。这种需求的使用场景是，在 React 父组件中通过不同的属性值渲染不同的组件。例如：

```
  import React from 'react';
  import {PhotoStory, VideoStory} from './stories';
  
  const components = {
    Photo: PhotoStory,
    Video: VideoStory
  };
  
  function Story(props){
    // 这是错误的，表达式不可以作为 JSX 的标签
    return <components[props.storyType] story={props.storyType} />
  }
  
  // 我们可以通过以下方式来修复
  function Story(props){
    const SpecialStory = components[props.storyType];
    return <SpecialStory story={props.storyType}>;
  }
```

# Props in JSX

在 JSX 中有几种不同的方式来指定属性。

