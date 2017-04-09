import React from 'react'

export default class Sizer extends React.Component {
  render() {
    return (
      <div className={'sizer-wrapper'}>
        <div className={'sizer'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
