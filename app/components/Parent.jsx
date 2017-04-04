/**
 * create by John at 2017/4/4 0004
 */
import React from 'react';
import FunctionalComponent from './FunctionalComponent.jsx';

class Parent extends React.Component{
  componentDidMount(){
    console.log('Parent:', this.textInput);
  }

  render(){
    return (
      // 函数式的 React 组件使用 ref 时是不会有组件实例的
      <FunctionalComponent
        ref={input => {
          console.log('FunctionalComponent ref callback:', input);
          this.textInput = input;
        }}
      />
    );
  }
}

export default Parent;