import React from 'react'

export default class DifficultySelector extends React.Component{
  constructor() {
    super()
    this.levels = [
      {
        name: 'easy',
        size: [9, 9],
        mines: 10
      },
      {
        name: 'medium',
        size: [16, 16],
        mines: 40
      },
      {
        name: 'hard',
        size: [30, 16],
        mines: 99
      }
    ]
  }

  render() {
    return (
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '20px',
          width: '50%',
          height: '50%',
          margin: 'auto',
          boxShadow: '0 0 2px 2px #333',
          zIndex: 1,
          ...this.props.style
        }}
        >
        {
          this.levels.map(level => (
            <div
              key={level.name}
              style={{height: '100px', cursor: 'pointer'}}
              onClick={() => this.props.startGame(level.size, level.mines)} >
              <div style={{fontSize: '30px', textAlign: 'center'}} >
                <h2 style={{margin: 0}} >{level.name}</h2>
              </div>
              <div style={{fontSize: '20px', textAlign: 'center'}} >
                size: {level.size.join('*')}, mines: {level.mines}
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}