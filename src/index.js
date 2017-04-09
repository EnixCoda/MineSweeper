import React from 'react'
import ReactDOM from 'react-dom'
import Sizer from './components/Sizer'
import MineSweeper from './components/MineSweeper'

import './style.css'

ReactDOM.render(
  <Sizer>
    <MineSweeper />
  </Sizer>,
  document.querySelector('#game-view')
)
