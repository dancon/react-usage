/**
 * create by John at 2017/4/4 0004
 */
import React from 'react';
import CustomInput from './CustomInput';

class AutoFocusTextInput extends React.Component{
  componentDidMount(){
    this.textInput.focus();
  }

  render(){
    return (
      <CustomInput ref={
        (input) => {
          console.log('AutoFocusTextInput:', input);
          this.textInput = input;
        }
      } />
    );
  }
}

export default AutoFocusTextInput;