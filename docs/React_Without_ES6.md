# React Without ES6

正常情况下，我们使用 ES6 class 语法定义 React Component 就可以了。

```
  class Greeting extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  }
```

但是如果你还没有用过 ES6, 那也没有关系，我们可以使 `React.createClass` 来代替：

```
  var Greeting = React.createClass({
    render: function() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  });
```

除了一些特殊情况，ES6 class 和 `Reate.createClass` 是非常相似的。

### Declaring Prop Types and Default Props

对于函数式和 ES6 class 式的组件， `propsType` 和 `defaultProps` 是定义在组件自身上的属性：

```
  class Greeting extends React.Component {
    // ...
  }
  
  Greeting.propTypes = {
    name: React.PropTypes.string
  };
  
  Greeting.defaultProps = {
    name: 'Mary'
  };
```

在使用 `React.createClass()`, 我们应该在 `propsType` 定义在注入方法的对象上，`defaultProps` 需要定义为 `getDefaultProps` 函数：

```
  var Greeting = React.createClass({
    propTypes: {
      name: React.PropTypes.string
    },
  
    getDefaultProps: function() {
      return {
        name: 'Mary'
      };
    },
  
    // ...
  
  });
```

### Setting the Initial State

在 ES6 class中，我们只需要在构造函数中通过为 `this.state` 赋值就可以为组件提供初始状态：

```
  class Counter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {count: props.initialCount};
    }
    // ...
  }
```

使用 `React.createClass` 是，我们需要提供一个单独的方法 `getInitialState` 返回初始 state 对象：

```
  var Counter = React.createClass({
    getInitialState: function() {
      return {count: this.props.initialCount};
    },
    // ...
  });
```

### Autobinding

使用 ES6 定义的 React 组件中的自定义的事件处理器需要显示的调用 bind 来绑定 this：

```
  class SayHello extends React.Component {
    constructor(props) {
      super(props);
      this.state = {message: 'Hello!'};
      // This line is important!
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      alert(this.state.message);
    }
  
    render() {
      // Because `this.handleClick` is bound, we can use it as an event handler.
      return (
        <button onClick={this.handleClick}>
          Say hello
        </button>
      );
    }
  }
```

但是使用 `React.createClass` 时，这种显示的绑定时不需要的，因为所有的方法都会进行绑定：

```
  var SayHello = React.createClass({
    getInitialState: function() {
      return {message: 'Hello!'};
    },
  
    handleClick: function() {
      alert(this.state.message);
    },
  
    render: function() {
      return (
        <button onClick={this.handleClick}>
          Say hello
        </button>
      );
    }
  });
```

这就意味着，使用 ES6 时，需要写一些冗余的代码来为事件处理器来绑定 this, 但是这也是有点好处的，那就是在大型项目中，这种写法会有比较好的性能。

如果这些冗余代码让你特别膈应，我们可以结合 Babel 使用 ES6 实验性的 `Class Properties` 语法。

```
  class SayHello extends React.Component {
    constructor(props) {
      super(props);
      this.state = {message: 'Hello!'};
    }
    // WARNING: this syntax is experimental!
    // Using an arrow here binds the method:
    handleClick = () => {
      alert(this.state.message);
    }
  
    render() {
      return (
        <button onClick={this.handleClick}>
          Say hello
        </button>
      );
    }
  }
```

需要注意的时，这些实验性的特性在将来有可能发生变化，也有可能不会加入到最终的语言特性中。

如果想保守使用，有以下几点建议：

* 在构造函数中绑定函数

* 使用箭头函数 `onClick={(e) => {this.handleClick();}}`

* 坚持使用 `React.createClass`

### Mixins

> Note: ES6 不支持任何 mixin, 所以用 ES6 写 React 应用时，就没有办法使用 React 的 mixin 功能了。但是我们同时也发现了很多使用 mixin 导致的问题，所以不在推荐在新码的代码中使用 mixin.

有时候，完全不相同的组件也会有一些共用的方法，被称作 ` cross-cutting concerns`, `React.createClass` 方式允许我们使用历史遗留的 `mixins` 系统来实现不同组件间方法的复用。

一个常见的使用场景时，一个组件希望通过定时器来更新 UI，但是我们需要在组件销毁的时候清除掉这个定时器。 React 提供了一个生命周期方法可以在组件装载和卸载时做一些事情。如下代码就创建了一个能够在组件销毁是自动清除的 `setInterval()` 方法。

```
  var SetIntervalMixin = {
    componentWillMount: function() {
      this.intervals = [];
    },
    setInterval: function() {
      this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
      this.intervals.forEach(clearInterval);
    }
  };
  
  var TickTock = React.createClass({
    mixins: [SetIntervalMixin], // Use the mixin
    getInitialState: function() {
      return {seconds: 0};
    },
    componentDidMount: function() {
      this.setInterval(this.tick, 1000); // Call a method on the mixin
    },
    tick: function() {
      this.setState({seconds: this.state.seconds + 1});
    },
    render: function() {
      return (
        <p>
          React has been running for {this.state.seconds} seconds.
        </p>
      );
    }
  });
  
  ReactDOM.render(
    <TickTock />,
    document.getElementById('example')
  );
```

如果一个组件使用了多个 mixin 而其中有几个又定义了相同的生命周期方法，那么这些生命周期方法都会被调用，调用的顺序就是组件中 `mixins` 中各个 mixin 声明的顺序。