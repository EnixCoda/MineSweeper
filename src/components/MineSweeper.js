import React from 'react'

import Cell from './Cell'
import Timer from './Timer'
import GameCore from '../GameCore.js'
import DifficultySelector from './DifficultySelector'

class Minesweeper extends React.Component {
  constructor() {
    super()
    this.state = {
      GameCore,
      gamePad: [],
    }
    this.update = this.update.bind(this)
    setInterval(() => {
      this.setState({
        time: GameCore.time
      })
    }, 1000)
  }

  update(gamePad) {
    this.setState({
      gamePad,
    })
  }

  render() {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        >
        <DifficultySelector
          style={{
            display: GameCore.isEnd() ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
          startGame={(size, mines) => {this.update(GameCore.reset({width: size[0], height: size[1], mines}))}}
          />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
          >
          <Timer time={this.state.time} />
          <button onClick={() => this.update(GameCore.shiftBack())}>back</button>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}
          >
          <div
            style={{
              flex: 1,
            }}
            >
            <div style={{fontSize: 0, height: '100%'}}>
              {
                this.state.gamePad.map((row, j) => {
                  return (
                    <div key={j} style={{display: 'flex'}}>
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
          </div>
        </div>
      </div>
    )
  }
}

export default Minesweeper
