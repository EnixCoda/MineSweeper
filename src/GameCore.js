class GameCore {
  constructor() {
    this.needMine = true
    this.statuses = {
      normal: 'normal',
      toDig: 'toDig',
      toBoom: 'toBoom'
    }
    this.gamePad = [[{}]]
    this.gameStates = []
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
      gamePad[i][j].focusing = true
    } else if (this.status === this.statuses.toBoom) {
      this.walkAround([i, j], (i, j) => {
        gamePad[i][j].focusing = true
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

  reset({width = 12, height = 12, mines = 36} = {}) {
    this.width = width
    this.height = height
    this.mines = mines
    this.toNormal()
    this.needMine = true
    this.gamePad = new Array(width)
      .fill()
      .map((_, i) => 
        new Array(height)
          .fill()
          .map((_, j) => {
            return {
              position: [i, j],
              level: 0
            }
          })
      )
    this.gameStates.length = 0
    return this.gamePad
  }

  scatterMines(safePosition) {
    const minePositions = []
    let count = 0
    let passedSafePosition = false
    const TOTAL_CELL_COUNT = this.width * this.height
    this.gamePad.forEach((row, i) => 
      row.forEach((cell, j) => {
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
          this.walkAround([i, j], (i, j) => this.gamePad[i][j].level++)
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
      this.gamePad = this.gameStates[this.gameStates.length - 1]
    }
    return this.gamePad
  }

  scan([i, j], pad) {
    /**
     * scan from pad[i][j], get the whole area to open(not flagged and level 0)
     */
    if (pad[i][j].level > 0) throw new Error('not a position to scan')
    const openArea = []
    this.walkAround([i, j], (i, j) => {
      if (!pad[i][j].digged) {
        pad[i][j].digged = true
        openArea.push([i, j])
        if (pad[i][j].level === 0) {
          openArea.push(...this.scan([i, j], pad))
        }
      }
    })
    return openArea
  }

  // actions: dig, flag, boom
  dig([i, j], notLog = false) {
    if (this.needMine) {
      this.scatterMines([i, j])
      this.needMine = false
    }
    if (!this.gamePad[i][j].digged) {
      const gamePad = JSON.parse(JSON.stringify(this.gamePad))
      let digArea = [[i, j]]
      if (gamePad[i][j].level === 0){
        digArea = this.scan([i, j], gamePad)
      }
      digArea.forEach(([i, j]) => {
        if (!gamePad[i][j].flagged) gamePad[i][j].digged = true
      })
      if (!notLog) {
        this.gameStates.push(gamePad)
      }
      console.log(this.gameStates.length)
      this.gamePad = gamePad
      this.toNormal()
    }
    return this.gamePad
  }

  flag([i, j]) {
    if (!this.gamePad[i][j].digged) {
      const gamePad = JSON.parse(JSON.stringify(this.gamePad))
      gamePad[i][j].flagged = !gamePad[i][j].flagged
      this.gameStates.push(gamePad)
      this.gamePad = gamePad
    }
    this.toNormal()
    return this.gamePad
  }

  boom([i, j]) {
    if (!this.gamePad[i][j].isMine) {
      let countMinesAround = 0
      this.walkAround([i, j], (i, j) => {
        if (this.gamePad[i][j].flagged) countMinesAround++
      })
      if (countMinesAround === this.gamePad[i][j].level) {
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