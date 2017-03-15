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