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

### JavaScript Expressions

我们可以传递一个 Javascript 表达式作为 Component 属性的值，但是我们需要把表达式包括在 `{}` 中。比如，在 JSX 中：

```
  <MyComponent foo={1 + 2 + 3 +4} />
```

对于 `MyComponent`, `props.foo` 的值为 `10`， 因为表达式 `1 + 2 + 3 + 4` 的值就是 `10`.

由于 `if` 语句和 `for` 循环不是 JS 表达式，所以不能在 JSX 中直接使用，但是我们可以在这些逻辑语句中使用 JSX. 如下：

```
  function NumberDescriber(props){
    let description;
    if(props.number % 2 == 0){
      description = <strong>even</strong>
    }else{
      description = <i>odd</i>
    }
    
    return <div>{props.number} is an {description} number.</div>
  }
```

### String Literals

我们也可以传递一个 Sting 字面量作为 Component 的属性。以下两个 JSX 表达式是等价的：

```
    <MyComponent message="hello world" />
    
    <MyComponent message={'hello world'} />
```

当我们传递一个 String 字面量的时候，React 会进行 HTML 转义，所以以下两个 JSX 表达式是等价的：

```
  <MyComponent message="&lt;3" />
  
  <MyComponent message=">3" />
```

React 的这种行为并不是非常的主要，出于文档完整性要求，仅仅在这里提及一下。

### Props Default to "True"

如果你没有给属性指定任何值，默认值为 `true`, 以下两个表达式是等价的：

```
  <MyTextBox autocomplete />
  
  <MyTextBox autocomplete={true} />
```

通常情况，React 不推荐使用这是默认值的方式，因为这容易和 `ES6 Object` 的简写方式冲突，在 ES6 中 `{foo}` 是 `{foo: foo}` 的简写，而不是 `{foo: true}` 的简写。React 支持这种行为仅仅是为了与 HTML 中的属性行为对齐。
  
### Spread Attributes

如果你已经有了一个属性集合的对象，而且你又想直接把它传递到 JSX 中，那么你可以使用 `...` 作为分解运算符来传递整个对象。以下两个组件是等价的：

```
  function App1(){
    return  <Greeting firstName="Ben" lastName="Hector" />
  }
  
  function App2(){
    const props = {
      firstName: 'Ben',
      lastName: 'Hector'
    };
    return <Greeting {...props}>
  }
```

通过这种方式指定属性的方式对于创建一种通用容器是非常有用的，但是这种方式可能会让你的代码变的一团糟，因为这种方式会传递一些容器不相关的属性到容器内部，所以使用这种方式前，一定要考虑清楚。

# Children in JSX

在 JSX 表达式中，包含在开标签与闭标签中的内容会被存储在一个特殊的属性 `props.children` 中，React 有几种不同的方式来传递子元素。

### String Literals

我们可以直接在开闭标签间传递字符串，这时 `props.children` 的值就是字符串。例如：

```
  <MyComponent>Hello World!</MyComponent>
```

这是一个合法的 JSX，而且 MyComponent 中 `props.children` 的值就是简单的字符串 `Hello World!`. HTML 代码将不会被编码，所以我们可以像编写 HTML 代码一样来编写 JSX。

```
  <div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX 将会移除行首尾的空格，也会移除开始/结束标签相邻的空行，字符串中间的空行将会被替换为一个空格， 所以以下代码将会渲染出相同的内容：

```
  <div>Hello World</div>
  
  <div>
    Hello World
  </div>
  
  <div>
    Hello
    World
  </div>
  
  <div>
  
    Hello World
  </div>
```

### JSX Children

我们也可以提供更多的 JSX 元素作为子元素，对于嵌套组件是非常有用的。

```
  <MyContainer>
    <MyFirstComponent />
    <MySecondComponent />
  </MyContainer>
```

我们也可以混合使用其他类型的元素来作为组件的子元素，所以你可以同时使用字符串字面量和其他组件（内置/自定义），这也是 JSX 和 HTML 类似的另一方面，所以，以下代码在 JSX 和 HTML 都是合法的：

```
  <div>
    Here is a list:
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
```

一个 React 组件不能返回多个 React 元素，但是一个 JSX 表达式可以包含多个子元素，所以如果你打算通过一个组件渲染多个内容，我们需要把带渲染的内容包含在一个 `div` 标签中。

### JavaScript Expressions

我们可以给 JSX 表达式传递任意一个合法的 JS 的表达式作为子元素，只要把表达式包含在 `{}` 中就可以了，所以以下表达式是等价的：

```
  <MyComponent>foo</MyComponent>
  
  <MyComponent>{'foo'}</MyComponent>
```

JSX 表达式中支持 JS 表达式对于渲染 JSX 元素列表是非常有用的。

```
  function Item(props) {
    return <li>{props.message}</li>;
  }
  
  function TodoList() {
    const todos = ['finish doc', 'submit pr', 'nag dan to review'];
    return (
      <ul>
        {todos.map((message) => <Item key={message} message={message} />)}
      </ul>
    );
  }
```

JS 表达式可以和其他类型的元素混合使用。

```
  function Hello(props) {
    return <div>Hello {props.addressee}!</div>;
  }
```

### Functions as Children

通常，插入 JSX 表达式中的 JS 表达式会被计算为字符串，React 元素或者是这些结果的列表，`props.children` 可以接受各种类型的数据，不仅仅是 React 知道如何渲染的数据，`props.children` 还可以接受一个函数作为回调。

```
  function Repeat(props) {
    let items = [];
    for (let i = 0; i < props.numTimes; i++) {
      items.push(props.children(i));
    }
    return <div>{items}</div>;
  }
  
  function ListOfTenThings() {
    return (
      <Repeat numTimes={10}>
        {(index) => <div key={index}>This is item {index} in the list</div>}
      </Repeat>
    );
  }
```

通过 `props.children` 可以传递任意元素作为自定义组件的子元素，只能 React 在渲染前能转换为 React 识别的类型就可以了。这种用法并不是通用的，但是如果你想扩展 React 的能力，这种用法是非常有用的。

### Booleans, Null, and Undefined Are Ignored

`false` `null` `undefined` 和 `true` 都是合法的子元素，但是 React 会忽略这些表达式。以下表达式渲染的结果是相同的：

```
  <div />
  
  <div></div>
  
  <div>{false}</div>
  
  <div>{null}</div>
  
  <div>{undefined}</div>
  
  <div>{true}</div>
```

在通过条件判断渲染 React 元素是非常有用的，如下代码，只有 `showHeader` 值为 `true` 时才会渲染 `<Header />`

```
  <div>
    {showHeader && <Header />}
    <Content />
  </div>
```

需要注意的是，一些js能隐式转化为假值的值，在 JSX 也会被渲染，比如 0 ，如下代码将不会像预期那样在 `props.message.length` 为 `0` 时不做任何渲染，而且会打印出一个 0.

```
  <div>
    {props.messages.length &&
      <MessageList messages={props.messages} />
    }
  </div>
```

进入如下修改可以达到预期，我们必须确定 `&&` 前面的操作数时布尔类型

```
  <div>
    {props.messages.length > 0 &&
      <MessageList messages={props.messages} />
    }
  </div>
```

相反，如果我们确实想渲染出 `true` `false` `null` `undefinded`, 那么我们必须把这些值转换为字符串。

```
  <div>
    My JavaScript variable is {String(myVariable)}.
  </div>
```