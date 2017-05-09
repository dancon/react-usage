# Refs and the DOM

在 React 数据流中，`props` 是父组件与子组件交互的唯一方式。为了能够修改子组件，我们只能为 props 提供新值然后重新渲染。然后，总是会有一些场景，让我们使用 props 无法达到我们的目的。要被修改的子内容，可以是 React Component 的实例，也可以是 DOM 元素。React 提供了一种安全的方式来达到修改 React Component 元素或者 DOM 元素。

### When to Use Refs

使用 `ref` 的场景：

* 管理 focus， 文案选中，媒体播放；

* 触发必要的动画；

* 集成第三方 DOM 操作库；

如果通过是 props 声明可以完成的事情就必要使用 refs.

比如，如果我们可以通过提供一个 `props.isOpen` 来控制 `Dialog` 的 开/关，那就不用对外提供 `open()` 和 `close()` 方法。

### Adding a Ref to a DOM Element

React 提供一个可以附属到任何一个组件上的特殊属性 `ref`. `ref` 可以接收一个回调函数，而这个回调函数会在在组件装载和卸载后立即调用。

当 `ref` 属性用于一个 HTML 元素时，`ref` 的回调函数会接收当前的元素作为它的参数，如下代码，ref 回调函数将保存一个 DOM 元素的引用：

```
  class CustomTextInput extends React.Component {
    constructor(props) {
      super(props);
      this.focus = this.focus.bind(this);
    }
  
    focus() {
      // Explicitly focus the text input using the raw DOM API
      this.textInput.focus();
    }
  
    render() {
      // Use the `ref` callback to store a reference to the text input DOM
      // element in an instance field (for example, this.textInput).
      return (
        <div>
          <input
            type="text"
            ref={(input) => { this.textInput = input; }} />
          <input
            type="button"
            value="Focus the text input"
            onClick={this.focus}
          />
        </div>
      );
    }
  }
```

React 将在组件装载后调用 ref 的回调函数，并注入当前 DOM 元素，而且在组件被卸载后也调用该回调函数，并注入 `null`.

为了能获取 DOM 元素，使用 `ref` 回调函数为类设置一个 DOM 元素引用的属性是一个常用的模式，首选的方式就是像上面的示例一样，在 `ref` 回调中设置属性，更简短的写法是 `ref={input => this.textInput = input}`

### Adding a Ref to a Class Component

当在以 class 方式声明的组件上使用 `ref` 回调函数的时候，注入到回调中的是 Component 的实例，比如，如果我们想在 `CustomTextInput` 组件装载后自动选中，我们可以再对该组件进行一次如下封装：

```
  class AutoFocusTextInput extends React.Component {
    componentDidMount() {
      this.textInput.focus();
    }
  
    render() {
      return (
        <CustomTextInput
          ref={(input) => { this.textInput = input; }} />
      );
    }
  }
```

> Note： 再次强调，在自定义组件上使用 ref 只对通过 class 声明的组件生效。

```
  class CustomTextInput extends React.Component {
    // ...
  }
```

### Refs and Functional Components

** 我们不可以在通过函数方式声明的组件上使用 `ref`,** 因为这种方式声明的组件没有创建实例。

```
  function MyFunctionalComponent() {
    return <input />;
  }
  
  class Parent extends React.Component {
    render() {
      // ref 回调会被调用，但是 input 为 null
      return (
        <MyFunctionalComponent
          ref={(input) => { this.textInput = input; }} />
      );
    }
  }
```

如果我们需要使用 ref, 那么我们就应该像使用生命周期方法和 state 一样把函数式的组件转换为 class 式的。

虽然不能在为函数式的组件使用 `ref` 属性，但是我们能在函数式的组件内部在在 DOM 元素和 class 组件使用该属性。

```
  function CustomTextInput(props) {
    // textInput must be declared here so the ref callback can refer to it
    let textInput = null;
  
    function handleClick() {
      textInput.focus();
    }
  
    return (
      <div>
        <input
          type="text"
          ref={(input) => { textInput = input; }} />
        <input
          type="button"
          value="Focus the text input"
          onClick={handleClick}
        />
      </div>
    );  
  }
```

### Don't Overuse Refs

如果你的第一想法仅仅是使用 `ref` 去实现 app 的功能，花点时间仔细的思考下 `state` 所属的 component 层级。

### Legacy API: String Refs

如果你用过 React 之前的版本，那么你可能对 `ref` 属性的值为 string 会比较熟悉。在老版本中，在我们可以为 `ref` 指定值为 `"textInput"` 那么我们可以在元素内部通过 `this.ref.textInput` 来访问到该 DOM 元素，但是我们已经不推荐使用这种方式，因为这种方式有些问题，我们推荐使用上面的回调函数模式。

### Caveats

如果 `ref` 的回调函数被定义成内联的，那么组件在更新的时候，这个回调函数会被调用两次，第一次 `null` 被注入，之后才是 DOM 元素，因为新的元素在更新的时候会先清理旧的 ref, 然后再设置一个新的。我们可以通过在 class 中定义回调函数，然后传递函数的引用给 `ref`. 但是这个负面影响在大多数情景下并没有什么影响。