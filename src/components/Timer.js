import React from 'react';

class Timer extends React.Component {
  padZero(number) {
    return `00${number}`.slice(-2)
  }

  format(timeInSecond = 0) {
    /**
     * 66 >> '01:06'
     */
    return `${this.padZero(Math.floor(timeInSecond / 60))}:${this.padZero(timeInSecond % 60)}`
  }

  render() {
    return (
      <span style={{fontSize: '30px'}} >{this.format(this.props.time)}</span>
    )
  }
}

export default Timer;
