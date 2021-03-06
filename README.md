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

我们可以在组件类内部声明一些方法，在组件转载和卸载的时候去执行一些代码：

```
  class Clock extends React.Component{
    constructor(props){
      super(props);
      this.state = {date: new Date};
    }
  
    // 声明周期方法：
    componentDidMount(){
      this.timeId = this.tick();
    }
  
    componentWillUnmount(){
      clearTimeout(this.timeId);
    }
  
    tick(){
      this.setState({
        date: new Date()
      });
  
      return setTimeout(this.tick, 1000);
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

这些方法叫做声明周期钩子。

`componentDidMount` 方法将在组件把返回的元素渲染成 DOM 元素后调用。这是设置计时器的最佳时期：

```
  componentDidMount(){
    this.timeId = this.tick();
  }
```

> NOTE: 这里我们在 this 对象上存储了计时器 ID

在 React 组件初始化设置完 this.props 和 this.state 后，我们可以随时在 this 对象上存储一些与组件状态（也就是不会在组件界面中显示的字段）无关的字段。

换句话，需要在 render() 方法中使用的字段，都必须存储在 this.state 对象上，否则存储在 this 对象上。

`componentWillUnmount` 方法将在组件生成的 DOM 元素被移除是调用，所以我们在这个声明钩子中移除了计时器 Id

```
  componentsWillUnMount(){
    clearTimeout(this.timeId);
  }
```

最后，我们来实现 tick 方法，tick 方法体将使用 this.setState（) 方法来更新组件的状态。

```
  tick(){
    this.setState({
      date: new Date()
    });
    
    return setIimeout((() => {this.tick();}, 1000);
  }
```

至此， Clock 就可以正常的运转了。

接下来，我们快速的回顾下我们刚才做了什么，并整理下这些声明周期方法执行的顺序。

1）当我们在 `<Clock />` 做为参数传递给 `ReactDom.render()` 方法的时候，React 会调用组件的构造方法。由于 Clock 要显示当前的时间，所以在 Clock 的构造函数中使用包含了当前时间的对象初始化了 this.state， 之后我们将更新这个时间。

2）接下来，React 将调用组件的 render() 方法，React 通过这个方法来渲染组件界面，更新组件所匹配的 DOM 元素。

3）当 Clock 返回的元素被插入到 DOM 树中后，componentsDidMount() 方法将被调用。方法体的内容是执行了 tick() 方法。

4) tick() 通过 setState() 更新组件的当前的时间，并再次调用 tick. 多亏了 setState 方法，当 React 知道 state 发生变化后，会再次调用 render() 更新界面。

5）一旦 Clock 组件被移除后，componentsWillUnMount 生命周期方法将被调用。清除计时器。

# Using State Correctly

关于 setState() 这里有三件事情需要注意:

### 不能直接修改 state

比如，如下

```
  this.state.comment = 'hello';
```

已上代码并不如触发组件的 re-render. 必须通过 setState() 函数来更新。

```
  this.state = {
    comment: 'hello'
  };
```

唯一可以直接给 state 赋值地方是组件的构造函数。

### State 的更新可能是异步的

React 为了性能，可能在单独的一个更新中，多次调用 setState() 方法。

因为 this.props 和 this.state 属性值可能是异步更新的，所以我们不能依赖于直接使用这些属性的值来计算下一次更新的状态值。比如：

```
  this.setState({
    counter: this.state.counter + this.props.increment
  });
```

如上代码可能到不到我们预期的效果。

要修复上述问题，我们可以使用 setState 方法接收函数的方式。 函数的接受两个参数，第一个参数是组件上一个 this.state 的值，第二个参数是 this.props 的当前值。

```
  this.setState((prevState, props) => ({
    counter: prevState.counter + props.increment
  }));
```

除了使用箭头函数外，我们还可以使用常规的函数

```
  this.setState(function(prevState, props){
    return {
      counter: prevState.counter + props.increment
    }
  });
```

### State Updates are Merged

当你调用 setState 方法的时候，React 会把传给 setState 的对象合并到组件的当前状态中。

比如：你的组件包含几个独立的变量，如下：

```
  constructor(){
    super(props);
    this.state = {
      posts: [],
      contents: []
    }
  }
```

然后你调用 setState 来单独的更新其中一个变量：

```
  componentsDidMount(){
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });
    
    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

# The Data Flows Down

一个组件不管是处于父层还是子层，都无法知道另外一个组件是动态组件，还是静态组件，而且相互之间也不应该关心组件是通过函数式还是类式声明的。

这也正是为什么 state 被称为本地属性或私有属性。一个组件的 state 属性值对另外一个组件是不可见的。

但是一个组件的 state 值可以通过 props 的方式传递给他的自组建：

```
  <FormattedDate date={this.state.date} />
```

FormattedDate 组件通过自己的 props 属性接受了 date 值，但是他无法确定 date 曾经是 Clock 组件的 state 还是 props 还是有用户直接输入的。

```
  function FormattedDate(props){
    return (<h2>It is {props.date.toLocaleTimeString()}</h2>);
  }
```

通常这叫做“自顶向下” 或者 “单向” 的数据流。任何组件的 state 只能属于定义他的组件，任何有 state 驱动的数据或者 UI 只能影响组件树中位于当前组件底部的组件。

我们可以把组件树理解成属性的瀑布流，每个组件的 state 就是一个额外的水源，他可以在任意节点汇入到瀑布流中，但是他也只能继续向下流。

为了证明所有的组件实例都是相互隔离的，我们可以创建一个 App 组件，他的内容就是渲染三个 Clock 组件：

```
  function App(){
    return (
      <div>
        <Clock />
        <Clock />
        <Clock />
      </div>
    );
  }
  
  ReactDom.render(
    <App />,
    document.getElementById('app-container');
  );
```

App 中的每个 Clock 都有自己的计时器，并且独立更新。

在 React 应用中，一个组件是静态的还是动态的被认为是组件内部的实现细节,我们可以在动态组件用引用静态组件，反之亦然。

# Handling Events

为 React 元素绑定事件和为 DOM 元素绑定事件是非常相似的，仅仅是语法上的区别：

* React 事件是通过驼峰式属性来绑定事件处理器的，而不是小写方式。

* 在 JSX 中传递函数来作为处理器，而不是字符串。

比如：

```
  <button onclick="activateLasers()">
    Active lasers
  </button>
```

和 React 事件绑定的区别是非常微小的。

```
  <button onClick={activateLasers}>
    Active lasers
  </button>
```

另外一个比较大的区别是：

在 React 中，不能在事件处理器中返回 false 来阻止元素的默认行为，必须显示的调用 preventDefault() 方法。

在纯 Html 页面中，要阻止一个超链接的默认行为（打开新的页面），我们可以通过以下代码实现：

```
  <a href="#" onclick="console.log('The link was clicked.'); return false">
    Click me
  </a>
```

在 React 中要实现同样的效果，只能如下：

```
  class ActionLink extends React.Component{
    handlClick(event){
      event.preventDefault();
      console.log('React the link is clicked');
    }
    
    render(){
      return (
        <a onClick={this.handlClick} href="http://www.baidu.com">React 百度一下</a>
      );
    }
  }
  
  ReactDom.render(
    <ActionLink />,
    document.getElementById('link-container')
  );
```

其中，`event` 是并不是原生的事件对象，而是 React 遵循 W3C 规范重新合成的事件对象，所以我们也不需要考虑兼容性问题。

使用 React 我们并不需要等到 React 元素真正渲染到 DOM 中侯再 调用 `addEventLister` 方法来为元素绑定事件，只需要在元素渲染的时候提供一个监听器就可以了。

在使用 ES6 的 class 定义一个组件的时候，绑定事件的通用模式是把事件处理器作为类的一个方法。如下代码：渲染了一个按钮，使用户在点击的时候能够在 ON / OFF 两个状态间切换。

```
  class Toggle extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        isToggleOn: true
      };
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(){
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render(){
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      );
    }
  }
  
  ReactDom.render(
    <Toggle />,
    document.getElementById('toggle-container')
  );
```

此时，我们必须注意 `this` 在 JSX 回调中的含义，class 中在事件回调并不会默认把 this 指向当前类对象。如果你忘记绑定 this, 并把该方法作为事件回调，那么在方法真正被调用的时候 this 将是 undefined.

如果显示调用 `bind` 绑定让你不爽，那么你可以尝试以下两种方式：

1. 使用 `property initializer syntax`

```
  class LogginButton extends React.Component{
    handleClick = () => {
      console.log('this is:', this);
    }
  
    render(){
      return (
        <button onClick={this.handleClick}>Click me</button>
      );
    }
  }
  
  ReactDom.render(
    <LogginButton />,
    document.getElementById('log-container')
  );
```

> React 默认并不支持这种语法

2. 绑定事件时，使用箭头函数

```
  class LogginButton extends React.Component{
      handleClick() {
        console.log('this is:', this);
      }
    
      render(){
        return (
          <button onClick={event => {this.handleClick(event);}}>Click me</button>
        );
      }
    }
    
    ReactDom.render(
      <LogginButton />,
      document.getElementById('log-container')
    );
```

> 但是这种用法是有弊端的，每次点击的时候都会创建一个新的回调函数作为事件处理器，在大多数的场景下还是可以接受的。但是如果我们在这个回调函数作为属性值传递到子组件中时，那么父级和相关子组件都将产生额外的重新渲染，所以通常情况下，我们推荐在构造函数显示绑定或者使用 `property initializer syntax` 来避免这种性能问题。