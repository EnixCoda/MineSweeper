import React from 'react'

import Cell from './Cell'
import Timer from './Timer'
import GameCore from '../GameCore.js'

class Minesweeper extends React.Component {
  constructor() {
    super()
    this.state = {
      gamePad: GameCore.reset(),
      gamePadSize: this.parseSize(GameCore.getSize())
    }
    this.update = this.update.bind(this)
  }

  parseSize(size) {
    let width, height
    if (size.width > size.height) {
      width = '100%'
      height = `${size.height / size.width * 100}%`
    } else {
      height = '100%'
      width = `${size.width / size.height * 100}%`
    }
    return {width, height}
  }

  update(gamePad) {
    this.setState({
      gamePad,
      gamePadSize: this.parseSize(GameCore.getSize())
    })
  }

  render() {
    return (
      <div style={{width: this.state.gamePadSize.width, height: this.state.gamePadSize.height, margin: '0 auto'}} >
        <div style={{fontSize: 0, display: 'flex', flexDirection: 'column', height: '100%'}}>
          {
            this.state.gamePad.map((row, j) => {
              return (
                <div key={j} style={{display: 'flex', flex: 1}}>
                  {
                    row.map((cell, i) => {
                      return (
                        <Cell
                          key={i}
                          cell={cell}
                          GC={GameCore}
                          update={this.update}
                          />
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}
          >
          <button onClick={() => this.update(GameCore.shiftBack())}>back</button>
        </div>
      </div>
    )
  }
}

export default Minesweeper
