/**
 * Created by John on 2017/3/15 0015.
 */
/*
 var React = require('react'),
 ReactDom = require('react-dom'),
 AppComponent = require('./components/productBox.jsx');

 ReactDom.render(<AppComponent />, document.getElementById('content'));*/

import React from 'react';
import ReactDom from 'react-dom';

const container = document.getElementById('content');

ReactDom.render(
  <h1>Hello world!</h1>,
  document.getElementById('content')
);

/**
 * jsx 类似于模板引擎，只不过支持 js 的任意表达式，
 *
 * 我们可以在 jsx 中定义 react 元素，通过 花括号 {} 嵌入任意合法的 js 表达式
 * */

function formateName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'John',
  lastName: 'Hou'
}, element = (
  <h1>Hello, {formateName(user)}</h1>
);

ReactDom.render(element, container);

/**
 * react element 在编译后也是一个普通的 javascript object
 *
 * 所以我们可以像使用 js 对象那样使用 react element
 *
 * Babel 在编译 jsx 的时候会调用 React.createElement() 方法来生成 DOM.
 *
 * 比如：
 *
 * const element = <h1 className="user-name">Hello, World!</h1>
 *
 * Babel 会编译为：
 *
 * React.createElement(
 *  'h1',
 *  {className: 'user-name'},
 *  'Hello, World!'
 * );
 *
 * 最后，React 会生成一个类似如下的对象：
 *
 * {
 *  type: 'h1',
 *  props: {
 *    className: 'user-name',
 *    children: 'Hello, World!'
 *  }
 * }
 * */

function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formateName(user)}</h1>
  } else {
    return <h1>Hello, Strange.</h1>
  }
}

ReactDom.render(getGreeting(), container);

/**
 * 默认情况下，React 会在渲染前，转换任何嵌入到 jsx 中的表达式的值，避免 XSS
 * */

// 渲染 React Element
(function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}</h2>
    </div>
  ), timeContainer = document.getElementById('time-container');

  ReactDom.render(element, timeContainer);

  setTimeout(tick, 1000);
})();

// 渲染 Component

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const selfDefinedElement = <Welcome name="Sara"/>;

ReactDom.render(selfDefinedElement, container);

// 组装 Components

function App() {
  return (
    <div>
      <Welcome name="Sara"/>
      <Welcome name="Cahal"/>
      <Welcome name="Edite"/>
    </div>
  );
}

ReactDom.render(
  <App />,
  container
);

// 抽取 components

// 复杂的 comment component
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

const author = {
  name: 'John',
  avatar: 'https://facebook.github.io/react/img/logo.svg'
};

ReactDom.render(<CommentP
  user={author}
  text="React 练习"
  date={new Date().toLocaleTimeString()}/>, document.getElementById('comment-container'));

// 抽取

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

// 组件的状态
/*
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

setInterval(tick, 1000);*/

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

    return setTimeout(() => {this.tick();}, 1000);
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

class AppX extends React.Component{
  render(){
    return (
      <div>
        <Clock />
        <Clock />
        <Clock />
      </div>
    );
  }
}

ReactDom.render(
  <AppX />,
  document.getElementById('app-container')
);

// 绑定事件
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