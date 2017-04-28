import React from 'react'

export default class FlexDiv extends React.Component {
  render() {
    return (
      <div
        style={{
          ...this.props.style,
          display: 'flex',
          flexDirection: this.props.direction || 'row',
          justifyContent: 'center',
        }}
          >
        {this.props.children}
      </div>
    )
  }
}
