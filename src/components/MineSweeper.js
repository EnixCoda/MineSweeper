import React from 'react'

import Cell from './cell'
import Timer from './timer'
import GameCore from '../GameCore.js'

class Minesweeper extends React.Component {
  constructor() {
    super()
    this.state = {
      gamePad: GameCore.load()
    }
    this.update = this.update.bind(this)
  }

  update(gamePad) {
    this.setState({
      gamePad
    })
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}} >
        <div style={{fontSize: 0, display: 'flex', flexDirection: 'column', height: '100%'}}>
          {
            this.state.gamePad.map((row, i) => {
              return (
                <div key={i} style={{display: 'flex', flex: 1}}>
                  {
                    row.map((cell, j) => {
                      return (
                        <Cell
                          key={j}
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
