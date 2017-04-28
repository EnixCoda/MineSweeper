import React from 'react'
import ReactDOM from 'react-dom'
import FlexDiv from './components/FlexDiv'
import MineSweeper from './components/MineSweeper'

import './style.css'

ReactDOM.render(
  <MineSweeper />,
  document.querySelector('#game-view')
)
