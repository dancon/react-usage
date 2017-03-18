# react-usage

### 环境的搭建

在开始 react 的学习之前，我们先搭建 react + webpack + babel 的环境

需要安装的组件如下：

webpack 系列：

webpack babel-loader css-loader style-loader

Babel 系列：

babel babel-preset-es2015 babel-preset-react

具体命令如下：

安装组件：

```
    npm install
```

执行命令：

```
    npm run build
```

# Rendering Elements

### Updating the Rendered Element

React Element 是不可改变的，一旦你创建了一个 `React Element`，那么你就将无法改变它的子元素或者属性，一个元素就像是一部电影中的一个画面，它代表了用户界面在某个时间点的一个快照。

到目前为止，更新 `React Element` 的唯一方法就是通过 `ReactDom.render()` 方法来重新渲染。

```
    (function tick(){
      const element = (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {new Date().toLocaleTimeString()}</h2>
        </div>
      ), timeContainer = document.getElementById('time-container');
    
      ReactDom.render(element, timeContainer);
    
      setTimeout(tick, 1000);
    })();
```

### React Only Updates What's Necessary

React Dom 每次都会比较当前元素及其子元素与前一个的差别，然后只修改不同的地方。

通过下图可以说明 React Dom 的更新原理

![](./resource/granular-dom-updates.gif)

虽然我们重新创建了一个元素来更新界面，但是只有文本节点在更新。

我们所考虑的是任意一时刻界面应该长什么样子，而不是考虑如何区修改元素。

# Extracting Components

不要害怕把组件抽取为更小的组件。

请看如下组件：

```
    function CommentP(props) {
      return (
        <div className="comment">
          <div className="userInfo">
            <img src={props.user.avatar} alt={props.user.name}/>
            <div className="userInfo-name">{props.user.name}</div>
          </div>
          <div className="comment-text">{props.text}</div>
          <div className="comment-date">{props.date}</div>
        </div>
      );
    }
    
    ReactDom.render(<CommentP
      user={{
        name: 'John',
        avatar: 'https://facebook.github.io/react/img/logo.svg'
      }}
      text="React 练习"
      date={new Date().toLocaleTimeString()}/>, document.getElementById('comment-container'));
```

该组件接收 user(Object) text(String) date(String) 作为参数，描述了一个社交网站常见的评论条。

但是这个组件相对由于嵌套了多层 React Element 而变得难以修改，嵌套的元素也无法单独复用，接下来我们就开始把这个复杂的组件抽取为一些小的，可复用的组件。

```
    // 用户头像
    function Avatar(props){
      return (
        <img src={props.user.avatar} alt={props.user.name} className="avatar"/>
      );
    }
    
    // 用户信息
    function UserInfo(props){
      return (
        <div className="userInfo">
          <Avatar user={props.user} />
          <div className="userInfo-name">{props.user.name}</div>
        </div>
      );
    }
    
    // 评论
    function Comment(props){
      return (
        <div className="comment">
          <UserInfo user={props.user} />
          <div className="comment-text">{props.text}</div>
          <div className="comment-date">{props.date}</div>
        </div>
      );
    }
    
    ReactDom.render(
      <Comment user={author} text="抽取出来的组件" date={Date.now()}/>,
      document.getElementById('comment-container-1')
    );
```

# Props are Read-Only

无论你是使用 function 模式，还是 class 模式定义一个组件，绝对不能修改组件的 props 值。

比如：

```
    functon sum(a, b){
        return a + b;
    }
```

sum 函数，没有修改自己的入参，只要入参相同，永远都返回相同的结果，这类函数叫做 “纯函数”。

再比如：

```
    function withdraw(account, amount){
        account.total -= amount;
    }
```

这个函数就不纯了，它修改了自己的入参。

虽说 React 是比较灵活的，但是却又一条铁则：

**所有的 React 组件都必须是纯函数，不能修改自己的 props**

然而，应用的界面必然会有动态改变的时候，接下来的部分，我们将介绍一个新的概念 “状态”，状态允许 React 组件在不违反这条铁则的前提下来修改用户界面。

# State and Lifecycle

回想我们之前编写的 嘀嗒钟 的例子

到目前为止，我们只学会了一种方式来更新用户界面，那就是 `ReactDom.render()`.

这一部分我们将学习如何编写一个真正的可复用，封装良好的 Clock 组件。Clock 将自自己每个一秒设置自己的时间。

首先封装好 clock 的界面。

```
    function Clock(props){
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {props.date.toLocaleString()}</h2>
        </div>
      );
    }
    
    function tick(){
      ReactDom.render(
        <Clock date={new Date} />,
        document.getElementById('clock-container')
      );
    }
    
    setInterval(tick, 1000);
```

上面的例子中，Clock 更新时间并不是自己内部的逻辑。

为了能让 Clock 自己更新时间，我们需要增加 state. 

state 与 props 类似，但是是完全由 Component 自己控制的私有属性。

我们之前也提到过，通过 ES2015 的 class 定义的 Component 具有额外的功能，本地状态（Local State）就是只有 class Component 具备的功能。

# Converting a Function to a Class

我们可以通过五步， 把函数式的 Clock 转换成 类式的 Component

1. 创建一个同名的继承了 `React.Component` 的 ES6 的类。

2. 在类内添加一个空的 render() 方法。

3. 把函数体内的代码移动到 render() 方法内。

4. 替换 render() 方法体中的 props 为 this.props.

5. 删除函数式的 component.

```
    class Clock extends React.Component{
      render(){
        return (
          <div>
            <h1>Hello, World!</h1>
            <h2>It is {this.props.date.toLocaleString()}</h2>
          </div>
        );
      };
    }
```

到这一步，我们就完成了类式组件的定义。

现在开始我们就可以使用类式组件的新功能了，本地状态和生命周期钩子。

# Adding Local State to a Class

接下来，我们将使用三步，将 dete 的调用从 props 移动到 state 上。

1）将 render() 方法中的 this.props.date 替换为 this.state.date.

```
    class Clock extends React.Component{
       render(){
         return (
           <div>
             <h1>Hello, World!</h1>
             <h2>It is {this.state.date.toLocaleString()}</h2>
           </div>
         );
       };
     }
```

2) 添加类的构造函数 constructor, 初始化 this.state.

```
    class Clock extends React.Component{
      constructor(props){
        super(props);
        this.state = {date: new Date};
      }
      
      render(){
        return (
          <div>
            <h1>Hello, World!</h1>
            <h2>It is {this.state.date.toLocaleString()}</h2>
          </div>
        );
      };
    }
```

> 子类中我们必须通过 super 调用，把 props 传递到基类中。

3）从 Clock 元素上移除 date 属性。

```
    ReactDom.render(
      <Clock />,
      document.getElementById('clock-container')
    );
```

至此，整体代码结构如下，稍后我们再添加 Clock 自更新时间的逻辑。

```
    class Clock extends React.Component{
      constructor(props){
        super(props);
        this.state = {date: new Date};
      }
    
      render(){
        return (
          <div>
            <h1>Hello, World!</h1>
            <h2>It is {this.state.date.toLocaleString()}</h2>
          </div>
        );
      };
    }
    
    ReactDom.render(
      <Clock />,
      document.getElementById('clock-container')
    );
```

# Adding Lifecycle Methods to a Class

在由许多组件组成的应用中，能在组件销毁时，能及时的回收所占用的资源是非常重要的。

我们期望在 Clock 组件在渲染成 DOM 的时候就设置一个计时器，在 React 中，这种行为被称为 “装载”。

同时我们也期望由 Clock 生成的 DOM 在被移除的时候能够清楚这个计时器，在 React 中，这种行为被称为 “卸载”。   