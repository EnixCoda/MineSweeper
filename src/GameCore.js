class GameCore {
  constructor() {
    this.needInit = true
    this.needMine = true
    this.statuses = {
      normal: 'normal',
      toDig: 'toDig',
      toBoom: 'toBoom'
    }
    this.time
    this.gamePad
    this.gameStates = []
  }

  isEnd() {
    return this.needInit
  }

  toNormal() {
    this.status = this.statuses.normal
    return this
  }

  isNormal() {
    return this.status === this.statuses.normal
  }

  toDig() {
    this.status = this.statuses.toDig
    return this
  }

  isToDig() {
    return this.status === this.statuses.toDig
  }

  toBoom() {
    this.status = this.statuses.toBoom
    return this
  }

  isToBoom() {
    return this.status === this.statuses.toBoom
  }

  focus([i, j]) {
    if (this.needMine) return this.gamePad
    const gamePad = JSON.parse(JSON.stringify(this.gamePad))
    if (this.status === this.statuses.toDig) {
      gamePad[j][i].focusing = true
    } else if (this.status === this.statuses.toBoom) {
      this.walkAround([i, j], (i, j) => {
        gamePad[j][i].focusing = true
      })
    }
    return gamePad
  }

  isValid([i, j]) {
    return i >= 0 && i < this.width && j >= 0 && j < this.height
  }

  walkAround([i, j], callback) {
    /**
     * walk through the 8 positions around [i][j], invoke callback on every position
     */
    let deltaI = -1, deltaJ
    while (deltaI <= 1) {
      deltaJ = -1
      while (deltaJ <= 1) {
        if (this.isValid([i + deltaI, j + deltaJ])) {
          callback(i + deltaI, j + deltaJ)
        }
        deltaJ++
      }
      deltaI++
    }
  }

  reset({width = 12, height = 6, mines = 6} = {}) {
    this.width = width
    this.height = height
    this.time = 0
    this.mines = mines
    this.toNormal()
    this.needMine = true
    this.needInit = false
    this.gamePad = new Array(height)
      .fill()
      .map((_, j) => 
        new Array(width)
          .fill()
          .map((_, i) => {
            return {
              position: [i, j],
              level: 0
            }
          })
      )
    this.gameStates.length = 0
    return this.gamePad
  }

  getSize() {
    return {
      width: this.width,
      height: this.height
    }
  }

  scatterMines(safePosition) {
    const minePositions = []
    let count = 0
    let passedSafePosition = false
    const TOTAL_CELL_COUNT = this.width * this.height
    this.gamePad.forEach((row, j) => 
      row.forEach((cell, i) => {
        let isMine
        // all mines scattered
        if (safePosition[0] === i && safePosition[1] === j || minePositions.length === this.mines) isMine = false
        // remaining positions count equals to remaining positions to scatter
        else if (TOTAL_CELL_COUNT - count - (passedSafePosition ? 0 : 1) === this.mines - minePositions.length) isMine = true
        // random
        else isMine = Math.random() < this.mines / (this.width * this.height)
        if (safePosition[0] === i && safePosition[1] === j) passedSafePosition = true
        cell.isMine = isMine
        if (isMine) {
          minePositions.push([i, j])
          this.walkAround([i, j], (i, j) => this.gamePad[j][i].level++)
        }
        count++
      })
    )
    this.gameStates.push(this.gamePad)
    return this.gamePad
  }

  shiftBack() {
    if (this.gameStates.length > 1) {
      this.gameStates.pop()
      this.needInit = false
      this.gamePad = this.gameStates[this.gameStates.length - 1]
    }
    return this.gamePad
  }

  scan([i, j], pad) {
    /**
     * scan from pad[j][i], get the whole area to open(not flagged and level 0)
     */
    if (pad[j][i].level > 0) throw new Error('not a position to scan')
    const openArea = []
    this.walkAround([i, j], (i, j) => {
      if (!pad[j][i].digged) {
        pad[j][i].digged = true
        openArea.push([i, j])
        if (pad[j][i].level === 0) {
          openArea.push(...this.scan([i, j], pad))
        }
      }
    })
    return openArea
  }

  // actions: dig, flag, boom
  dig([i, j], notLog = false) {
    if (this.needInit) {
      return this.gamePad
    }
    if (this.needMine) {
      this.scatterMines([i, j])
      this.needMine = false
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
    }
    if (!this.gamePad[j][i].digged) {
      const gamePad = JSON.parse(JSON.stringify(this.gamePad))
      let digArea
      if (gamePad[j][i].level === 0){
        digArea = this.scan([i, j], gamePad)
      } else {
        digArea = [[i, j]]
      }
      digArea.forEach(([i, j]) => {
        if (!gamePad[j][i].flagged) {
          gamePad[j][i].digged = true
          if (gamePad[j][i].isMine) {
            clearInterval(this.timer)
            this.needInit = true
            alert('GAME OVER')
          }
        }
      })
      if (!notLog) {
        this.gameStates.push(gamePad)
      }
      this.gamePad = gamePad
      this.toNormal()
    }
    return this.gamePad
  }

  flag([i, j]) {
    if (!this.gamePad[j][i].digged) {
      const gamePad = JSON.parse(JSON.stringify(this.gamePad))
      gamePad[j][i].flagged = !gamePad[j][i].flagged
      this.gameStates.push(gamePad)
      this.gamePad = gamePad
    }
    this.toNormal()
    return this.gamePad
  }

  boom([i, j]) {
    if (!this.needInit && !this.gamePad[j][i].isMine) {
      let countMinesAround = 0
      this.walkAround([i, j], (i, j) => {
        if (this.gamePad[j][i].flagged) countMinesAround++
      })
      if (countMinesAround === this.gamePad[j][i].level) {
        this.walkAround([i, j], (i, j) => {
          this.dig([i, j], true)
        })
      }
      this.gameStates.push(this.gamePad)
      this.toNormal()
    }
    return this.gamePad
  }
}

export default new GameCore()