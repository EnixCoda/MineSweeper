import React from 'react'

class Cell extends React.Component {
  render() {
    const {cell, GC, update} = this.props
    let cellContent
    const classNames = ['cell']
    if (cell.digged) {
      classNames.push('open')
      if (cell.isMine) classNames.push('mine')
      else classNames.push('level-' + cell.level)
      if (cell.isMine) cellContent = '*'
      else cellContent = cell.level || ''
    } else {
      if (cell.flagged) {
        cellContent = 'F'
        classNames.push('flag')
      } else {
        cellContent = ''
        if (cell.focusing) classNames.push('focus')
      }
    }

    return (
      <div
        className={classNames.join(' ')}
        style={{flex: '1 0'}}
        onMouseDown={({nativeEvent}) => {
          const {buttons} = nativeEvent
          if (buttons === 2) {
            // only right down
            update(GC.flag(cell.position))
          } else if (buttons === 1) {
            // only left down
            update(GC.toDig().focus(cell.position))
          } else if (buttons === 3) {
            // both down
            update(GC.toBoom().focus(cell.position))
          }
        }}
        onDoubleClick={() => {
          update(GC.boom(cell.position))
        }}
        onMouseUp={({nativeEvent}) => {
          if (GC.isToDig()) update(GC.dig(cell.position))
          else if (GC.isToBoom()) update(GC.boom(cell.position))
        }}
        onMouseEnter={({nativeEvent}) => {
          update(GC.focus(cell.position))
        }}
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
        >
        <div style={{paddingBottom: '100%'}} >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%)`,
              fontSize: '2rem',
              userSelect: 'none'
            }}
            >
            {cellContent}
          </span>
        </div>
      </div>
    )
  }
}

export default Cell
