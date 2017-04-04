import React from 'react';

// React refs
class CustomInput extends React.Component{
  constructor(props){
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus(){
    this.textInput.focus();
  }

  render(){
    return (
      <div>
        <input type="text" ref={(input) => {
          console.log('CustomInput:', input);
          this.textInput = input;
        }} />
        <input type="button" value="Focus the text input" onClick={this.focus} />
      </div>
    );
  }
}

export default CustomInput;