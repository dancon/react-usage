# React Without JSX

JSX 比不是使用 React 的必要条件。如果我们不想在我们的项目环境下设置一些编译环境，在 React 中不适用 JSX 语法也是可以的。

其实 JSX 中的每个元素只是 `React.createElement(component, props, ...children)` 的语法糖，所以任何 JSX 能做的事情，使用纯 js 代码也能做到。

比如如下代码：

```
  class Hello extends React.Component {
    render() {
      return <div>Hello {this.props.toWhat}</div>;
    }
  }
  
  ReactDOM.render(
    <Hello toWhat="World" />,
    document.getElementById('root')
  );
```
可以转义为如下不使用 JSX 的纯 JS 代码：

```
  class Hello extends React.Component {
    render() {
      return React.createElement('div', null, `Hello ${this.props.toWhat}`);
    }
  }
  
  ReactDOM.render(
    React.createElement(Hello, {toWhat: 'World'}, null),
    document.getElementById('root')
  );
```

如果对更多 JSX 转义为 JS 的示例，可以直接去[Babel 在线](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D)

`React.createElement(component, props, ...children)` 中，参数 `component` 既可以是一个字符串，也可以是 `React.Component` 的子类，还可以一个无状态组件的纯函数。
 
 如果你对 `React.createElement` 这么长的写法比较厌烦了，可以把他赋值给一个变量，这样撸码就清爽多了。
 
 ```
  const e = React.createElement;
  
  ReactDOM.render(
    e('div', null, 'Hello World'),
    document.getElementById('root')
  ); 
 ```
 
 使用这种赋值简写的方式撸 React 代码，慢慢的你就会觉得就跟使用 JSX 一样爽。