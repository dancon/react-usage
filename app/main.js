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

class LogginButton extends React.Component{
  /*handleClick = () => {
    console.log('this is:', this);
  }*/

  handleClick(){
    console.log('this is:', this);
  }

  render(){
    return (
      <button onClick={event => {this.handleClick(event)}}>
        Click me
      </button>
    );
  }
}

ReactDom.render(
  <LogginButton />,
  document.getElementById('log-container')
);

// React 条件

function UserGreeting(){
  return (
    <h2>Welcome back!</h2>
  );
}

function GuestGreeting(){
  return (
    <h2>please sign up.</h2>
  );
}

function Greeting(props){
  const isLoggedIn = props.isLoggedIn;

  if(isLoggedIn){
    return <UserGreeting />;
  }

  return <GuestGreeting />
}

ReactDom.render(
  <Greeting isLoggedIn={true} />,
  document.getElementById('greeting-container')
);

function LoginButton(props){
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props){
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  )
}

class LoginControl extends React.Component{
  constructor(props){
    super(props);

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);

    this.state = {
      isLoggedIn: false
    }
  }

  handleLoginClick(){
    this.setState({
      isLoggedIn: true
    });
  }

  handleLogoutClick(){
    this.setState({
      isLoggedIn: false
    });
  }

  render(){
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;

    if(isLoggedIn){
      button = <LogoutButton onClick={this.handleLogoutClick} />
    }else{
      button = <LoginButton onClick={this.handleLoginClick} />
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        <div>The user is <b>{isLoggedIn ? 'currently': 'not'}</b> logged in.</div>
        {button}
      </div>
    );
  }
}

ReactDom.render(
  <LoginControl />,
  document.getElementById('loginControl-container')
);

// 逻辑运算符 &&

function Mailbox(props){
  const unreadMessages = props.unreadMessages;

  return (
    <div>
      <h1>Hello</h1>
      {unreadMessages.length > 0 &&
        <h2>You have {unreadMessages.length} unread messages.</h2>
      }
    </div>
  );
}

const unreadMessages = ['React', 'Re:React', 'Re:Re:React'];
ReactDom.render(
  <Mailbox unreadMessages={unreadMessages} />,
  document.getElementById('mailbox-container')
);

// 如果要隐藏元素本身，返回 null 即可

/*function WarningBanner(props){
  if(!props.warn){
    return null;
  }

  return (
    <div>
      warning~
    </div>
  );
}*/

// 即使 component render 方法返回 null , 也不会影响声明周期方法的触发
class WarningBanner extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('Waring Component mounted');
  }

  componentWillUnmount(){
    console.log('Warning Component will unmount');
  }

  componentDidUpdate(){
    console.log('Warning Component did update');
  }

  componentWillUpdate(){
    console.log('Warning Component will update');
  }

  render(){
    if(!this.props.warn){
      return null;
    }
    return (
      <div>warning~</div>
    );
  }
}

class Page extends React.Component{
  constructor(props){
    super(props);
    this.handleToggleClick = this.handleToggleClick.bind(this);

    this.state = {
      showWarning: true
    };
  }

  handleToggleClick(){
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render(){
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDom.render(
  <Page />,
  document.getElementById('page-container')
);

// Lists and Keys

/*
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => {
    return (<li>{number}</li>)
  }
);

ReactDom.render(
  <ul>{listItems}</ul>,
  document.getElementById('list-container')
);
*/

function NumberList(props){
  const numbers = props.numbers;
  const listItems = numbers.map(number => {
    return (<li key={number.toString()}>{number}</li>);
  });

  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDom.render(
  <NumberList numbers={numbers} />,
  document.getElementById('list-container')
);

/**
 * React 中 key 是在遍历总用来唯一标识每一项的，最好是使用 遍历对象的唯一 id 来作为 key, 如果没有，使用项的索引也是可以的，但是在数组会重排的情况下，索引是不推荐作为 key 的。
 * */

function ListItem(props){
  const value = props.value;
  return (
    <li key={value.toString()}>
      {value}
    </li>
  );
}

/**
 * key 只在遍历的上下文中生效，所以在 ListItem Components 中指定 key 是没有用的，以下代码依旧会有 React warning.
 * */

function NumberListX(props) {
  const numbers = props.number;
  const items = numbers.map(number => (
    <ListItem value={number} />
  ));

  return (
    <ul>
      {items}
    </ul>
  );
}

/*ReactDom.render(
  <NumberListX number={numbers} />,
  document.getElementById('listx-container')
);*/

// 修改版
function ListItemX(props){
  const value = props.value;
  return (
    <li>{value}</li>
  );
}

function NumberListxx(props){
  const numbers = props.number;
  const items = numbers.map(number => (
    <ListItemX key={number} value={number} />
  ));

  return (
    <ul>
      {items}
    </ul>
  );
}

ReactDom.render(
  <NumberListxx number={numbers} />,
  document.getElementById('listx-container')
);

/**
 * key 在某次遍历中必须是唯一的，但是全局中并不需要唯一，可以在两次遍历中使用相同的 key 值
 * */

function Post(props){
  const posts = props.posts,
    // 我们可以把这次遍历直接 inline 到 JSX 中，不用单独声明一个变量来存储
    /*siderBar = (
      <ul>
        {
          posts.map(post => (
            <li key={post.id}>{props.id && post.id}{post.title}</li>
          ))
        }
      </ul>
    ),*/
    content = (
      <ul>
        {
          posts.map(post => (
            <li key={post.id}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            </li>
          ))
        }
      </ul>
    );

  return (
    <div>
      <ul>
        {
          posts.map(post => (
            <li key={post.id}>{props.id && post.id}{post.title}</li>
          ))
        }
      </ul>
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 111, title: 'Hello, world', content: 'This is a beautiful world'},
  {id: 112, title: 'React array', content: 'key is very strange'}
];

ReactDom.render(
  <Post posts={posts} />,
  document.getElementById('post-container')
);

/**
 * key 仅仅是 React 中的一个标识，并不会传递到组件内部
 * 如下： 你可以访问到 props.id 但是访问不到 props.key
 * */

const content = posts.map(post => (
  <Post key={post.id} id={post.id}></Post>
));

/**
 * React 中的 form 表单如果想实现提交时通过一个函数来处理，而不是默认的提交到一个新页面，那么我们可以通过 Controlled Component 来实现，也就是说 input 等 form element 的值由 React 来维护，也方便统一做校验，修改等
 * */

class NameForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: ''
    }

    const handler = ['handleChange', 'handleSubmit'];
    handler.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleChange(event){
    this.setState({
      value: event.target.value.toUpperCase()
    });
  }

  handleSubmit(event){
    event.preventDefault();
    alert('A name is submitted:' + this.state.value);
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value='Submit' />
      </form>
    );
  }
}

ReactDom.render(
  <NameForm />,
  document.getElementById('form-container')
);

// React 中的 textarea

class EssayForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: 'Please write a essay about you favorite form element.'
    }
    const handler = ['handleChange','handleSubmit'];
    handler.forEach(method => {
      this[method] = this[method].bind(this);
    })
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event){
    event.preventDefault();
    alert('A essay is submitted:' + this.state.value);
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange}></textarea>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDom.render(
  <EssayForm />,
  document.getElementById('essay-container')
);

// React select form element

class FlavorForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: 'coconut'
    }
    const handler = ['handleChange','handleSubmit'];
    handler.forEach(method => {
      this[method] = this[method].bind(this);
    })
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event){
    event.preventDefault();
    alert('A favorite flavor is submitted:' + this.state.value);
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick you favorite La Croix flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefrute">Grapefrute</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDom.render(
  <FlavorForm />,
  document.getElementById('flavor-container')
);

// Multiple inputs
class Reservation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuest: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event){
    const target = event.target,
      name = target.name,
      value = target.type == 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value
    });
  }

  render(){
    let output = null;
    if(this.state.isGoing){
      output = <output>将有{this.state.numberOfGuest}人出席</output>
    }else{
      output = <output>没有人出席。</output>
    }
    return (
      <div>
        <label>
          是否出席：
          <input type="checkbox" checked={this.state.isGoing} onChange={this.handleInputChange} name="isGoing" />
        </label>
        <label>
          出席人数：
          <input type="number" value={this.state.numberOfGuest} onChange={this.handleInputChange} name="numberOfGuest"/>
        </label>
        {output}
      </div>
    );
  }
}

ReactDom.render(
  <Reservation />,
  document.getElementById('multiple-input')
);

// 状态提升
function BoilingVerdict(props){
  if(props.celsius >= 100){
    return (<p>The water would boil.</p>);
  }

  return <p>The water would not boil.</p>
}

const scaleName = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.props.onTemperatureChange(event.target.value);
  }

  render(){
    const temperature = this.props.temperature,
      scale = this.props.scale;

    return (
      <fieldset>
        <legend>Please Enter temperature in {scaleName[scale]}</legend>
        <input type="text" value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}

// fahrenheit to celsius
function toCelsius(fahrenheit){
  return (fahrenheit - 32) * 5 / 9;
}

// celsius to fahrenheit
function toFahrenheit(celsius){
  return (celsius * 9 / 5) + 32;
}

// convert to string
function tryConvert(temperature, convert){
  const input = parseFloat(temperature);
  if(Number.isNaN(input)){
    return '';
  }

  const output = convert(input),
    rounded = Math.round(output * 1000) / 1000;

  return rounded + '';
}

class Calculator extends React.Component{
  constructor(props){
    super(props);
    /*
    this.state = {
      temperature: ''
    }

    this.handleChange = this.handleChange.bind(this);*/
    this.state = {
      scale: 'c',
      temperature: ''
    };
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
  }

  handleCelsiusChange(temperature){
    this.setState(
      {scale: 'c', temperature}
    );
  }

  handleFahrenheitChange(temperature){
    this.setState(
      {scale: 'f', temperature}
    );
  }

  /*handleChange(event){
    this.setState({
      temperature: event.target.value
    });
  }*/

  render(){
    /*const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input type="text" onChange={this.handleChange} value={this.state.temperature} />
        <BoilingVerdict celsius={parseFloat(temperature)}/>
      </fieldset>
    );*/

    const scale = this.state.scale,
      temperature = this.state.temperature,
      celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature,
      fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange}/>
        <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange}/>
        <BoilingVerdict celsius={celsius}/>
      </div>
    );
  }
}

ReactDom.render(
  <Calculator />,
  document.getElementById('boiling-container')
);

// composition
/**
 * children 是一个特殊的属性，他会把 React 元素标签中的所有内容赋值给该属性
 * */

function FancyBorder(props){
  return (
    <div className={"FancyBorder FancyBorder-" + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog(){
  return (
    <FancyBorder color="blue">
      <h1 className="dialog-title">
        Welcome
      </h1>
      <p className="dialog-message">
        Thank you visiting out website.
      </p>
    </FancyBorder>
  );
}

ReactDom.render(
  <WelcomeDialog />,
  document.getElementById('dialog-container')
);

// React 中的多个坑位就需要通过属性来实现了，由于 React Component 也是一个对象，所以我们可以像使用 js 对象那样通过组件的属性来传递 React 组件。

function SplitPane(props){
  return (
    <div className="splitPane">
      <div className="splitPane-left">
        {props.left}
      </div>
      <div className="splitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function Contacts(){
  return (
    <div>Left</div>
  );
}

function Chat(){
  return (
    <div>Right</div>
  );
}

function App(){
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      }
    />
  );
}

ReactDom.render(
  <App />,
  document.getElementById('split-container')
);

// 如果某个组件是另外一个组件的特殊实例，我们可以在特殊实例中渲染通用组件，并通过属性来实现特殊性
function Dialog(props){
  return (
    <FancyBorder color="blue">
      <h1 className="dialog-title">{props.title}</h1>
      <p className="dialog-message">{props.message}</p>
      {props.children}
    </FancyBorder>
  );
}

function SpecialDialog(){
  return (
    <Dialog title="Hello Dialog"
      message="This is a special Dialog"
    />
  );
}

ReactDom.render(
  <SpecialDialog />,
  document.getElementById('special-container')
);

// 登录弹框
class SignUpDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      login: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleChange(event){
    this.setState(
      {login: event.target.value}
    );
  }

  handleSignUp(){
    alert('Welcome ' + this.state.login + ' come back.');
  }

  render(){
    return (
      <Dialog title="Sign Up"
        message="Don't have a account, register"
      >
        <input type="text" value={this.state.login}
          onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>Sign Me Up</button>
      </Dialog>
    );
  }
}

ReactDom.render(
  <SignUpDialog />,
  document.getElementById('sign-container')
);

// Think in React

// 产品分类行
class ProductCategoryRow extends React.Component{
  render(){
    return (
      <tr><th cols="2">{this.props.category}</th></tr>
    );
  }
}

class ProductRow extends React.Component{
  render(){
    let name = this.props.product.stocked ?
      this.props.product.name :
      (<span style={{color: 'red'}}>{this.props.product.name}</span>)
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component{
  render(){
    let rows = [],
      lastCategory = null;

    this.props.products.forEach(product => {
      if(!~product.name.indexOf(this.props.filterText) || (!product.stocked && this.props.inStockOnly)){
        return;
      }

      if(product.category != lastCategory){
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
    this.handleInStockOnlyInputChange = this.handleInStockOnlyInputChange.bind(this);
  }

  handleFilterTextInputChange(event){
    this.props.onFilterTextInput(event.target.value);
  }

  handleInStockOnlyInputChange(event){
    this.props.onInStockOnlyInput(event.target.checked);
  }

  render(){
    console.log(this.props.inStockOnly);
    return (
      <form>
        <input type="text" value={this.props.filterText} onChange={this.handleFilterTextInputChange} placeholder="Search..." />
        <p>
          <input type="checkbox" value={this.props.inStockOnly} onChange={this.handleInStockOnlyInputChange}/>
          {' '}
          only show product in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleInStockOnlyInput = this.handleInStockOnlyInput.bind(this);
  }

  handleFilterTextInput(filterText){
    this.setState({
      filterText: filterText
    });
  }

  handleInStockOnlyInput(inStockInput){
    this.setState({
      inStockOnly: inStockInput
    });
  }

  render(){
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextInput={this.handleFilterTextInput}
          onInStockOnlyInput={this.handleInStockOnlyInput}
        />
        <ProductTable products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}

let PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDom.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('product-container')
);

// props.children 可以是函数
function Repeat(props){
  let items = [];
  for(let i = 0 ; i < props.numTimes; i ++){
    items.push(props.children(i));
  }

  return (<div>{items}</div>);
}

function ListOfTenThings(){
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}

ReactDom.render(
  <ListOfTenThings />,
  document.getElementById('repeat-container')
);