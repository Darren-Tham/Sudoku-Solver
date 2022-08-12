import { useState, useEffect, createRef, useCallback } from 'react'
import Block from './components/Block'
import { RED, LIGHT_GREEN, LIGHT_BLUE, TEXT_BLUE, PURPLE, WHITE, GRAY, BLACK } from './Colors'
import './App.css'
import ProgressBar from './components/ProgressBar'

const SIZE = 3
const NUMS = SIZE ** 2
const MAX_LEN = NUMS.toString().length
const TIME = 1000
const DECREMENT = 10
const MIN_TIME = 50
const FINALIZE_TIME = 25

const testBoard = [
  [
    [
      ['', '', '7'],
      ['', '9', '6'],
      ['2', '', '']
    ],
    [
      ['8', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    [
      ['9', '', ''],
      ['1', '2', ''],
      ['5', '', '']
    ]
  ],
  [
    [
      ['4', '1', ''],
      ['9', '', '8'],
      ['', '6', '3']
    ],
    [
      ['', '', ''],
      ['', '1', ''],
      ['4', '9', '2']
    ],
    [
      ['6', '', ''],
      ['', '3', '4'],
      ['8', '1', '']
    ]
  ],
  [
    [
      ['', '', ''],
      ['8', '', '1'],
      ['5', '4', '']
    ],
    [
      ['9', '4', ''],
      ['', '7', ''],
      ['', '3', '1']
    ],
    [
      ['', '5', ''],
      ['4', '6', ''],
      ['2', '8', '']
    ]
  ]
]

const BLACK_BORDER = `3px solid ${BLACK}`
const GRAY_BORDER = `1.5px solid ${GRAY}`

interface Border {
  borderTop: string;
  borderLeft: string;
  borderBottom?: string;
  borderRight?: string;
}

interface Indices {
  boardRow: number;
  sectionRow: number;
  boardCol: number;
  sectionCol: number;
}

interface UniqueValues {
  [key: string]: true;
}

const App: React.FC = () => {

  // const [values, setValues] = useState<string[][][][]>(create4DArr(''))
  const [values, setValues] = useState<string[][][][]>(testBoard)
  const [colors, setColors] = useState<string[][][][]>(create4DArr(WHITE))
  const [areSelected, setAreSelected] = useState<boolean[][][][]>(create4DArr(false))
  const [textColors, setTextColors] = useState<string[][][][]>(create4DArr(BLACK))
  const [lastIndices, setLastIndices] = useState<Indices | undefined>(undefined)
  const [isSolving, setIsSolving] = useState<boolean>(false)
  const [progressBarWidth, setProgressBarWidth] = useState<number>(0)
  const [transitionTime, setTransitionTime] = useState<number>(TIME)
  const [inputRefs] = useState<React.RefObject<HTMLInputElement>[][][][]>(setInputRefs())

  const checkRows = useCallback((newColors: string[][][][]) => {
    interface RowIndices {
      boardRow: number;
      sectionRow: number;
    }

    const invalidRows: RowIndices[] = []

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const uniqueValues: UniqueValues = {}
        let isValidRow = true

        for (let k = 0; k < SIZE && isValidRow; k++) {
          for (let l = 0; l < SIZE && isValidRow; l++) {
            const value = values[i][k][j][l]
            if (value === '') continue

            if (uniqueValues[value]) {
              invalidRows.push({
                boardRow: i,
                sectionRow: j
              })
              isValidRow = false
            } else {
              uniqueValues[value] = true
            }
          }
        }
      }
    }

    invalidRows.forEach(row => {
      const { boardRow, sectionRow } = row
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          newColors[boardRow][i][sectionRow][j] = RED
        }
      }
    })
  }, [values])

  const checkCols = useCallback((newColors: string[][][][]) => {
    interface ColIndices {
      boardCol: number;      
      sectionCol: number;
    }

    const invalidCols: ColIndices[] = []

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const uniqueValues: UniqueValues = {}
        let isValidCol = true

        for (let k = 0; k < SIZE && isValidCol; k++) {
          for (let l = 0; l < SIZE && isValidCol; l++) {
            const value = values[k][i][l][j]
            if (value === '') continue

            if (uniqueValues[value]) {
              invalidCols.push({
                boardCol: i,
                sectionCol: j
              })
              isValidCol = false
            } else {
              uniqueValues[value] = true
            }
          }
        }
      }
    }

    invalidCols.forEach(col => {
      const { boardCol, sectionCol } = col
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          newColors[i][boardCol][j][sectionCol] = RED
        }
      }
    })
  }, [values])

  const checkSections = useCallback((newColors: string[][][][]) => {
    interface BoardIndices {
      boardRow: number;
      boardCol: number;
    }

    const invalidSections: BoardIndices[] = []

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const uniqueValues: UniqueValues = {}
        let isValidSection = true

        for (let k = 0; k < SIZE && isValidSection; k++) {
          for (let l = 0; l < SIZE && isValidSection; l++) {
            const value = values[i][j][k][l]
            if (value === '') continue

            if (uniqueValues[value]) {
              invalidSections.push({
                boardRow: i,
                boardCol: j
              })
            } else {
              uniqueValues[value] = true
            }
          }
        } 
      }
    }

    invalidSections.forEach(section => {
      const { boardRow, boardCol } = section
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          newColors[boardRow][boardCol][i][j] = RED
        }
      }
    })
  }, [values])

  const highlightValues = useCallback((boardRow: number, boardCol: number, sectionRow: number, sectionCol: number) => {
    const newColors = create4DArr(WHITE)

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        newColors[boardRow][i][sectionRow][j] = LIGHT_BLUE
        newColors[i][boardCol][j][sectionCol] = LIGHT_BLUE
        newColors[boardRow][boardCol][i][j] = LIGHT_BLUE
      }
    }

    checkRows(newColors)
    checkCols(newColors)
    checkSections(newColors)

    setColors(newColors
      .map((bRow, i) => bRow
      .map((bCol, j) => bCol
      .map((sRow, k) => sRow
      .map((color, l) => {
        const currValue = values[i][j][k][l]
        if (currValue !== '' && currValue === values[boardRow][boardCol][sectionRow][sectionCol]) {
          return PURPLE
        }
        return color
      })))))
  }, [values, checkRows, checkCols, checkSections])

  const handleMove = useCallback((dir: string) => {
    let newIndices: Indices | undefined
    
    const newAreSelected: boolean[][][][] = areSelected
      .map((boardRow, i) => boardRow
      .map((boardCol, j) => boardCol
      .map((sectionRow, k) => sectionRow
      .map((isSelected, l) => {
        if (isSelected) {
          newIndices = getNewIndices(i, j, k, l, dir)
        }
        return false
      }))))

    if (newIndices === undefined) {
      newAreSelected[0][0][0][0] = true
      inputRefs[0][0][0][0].current?.focus()
      highlightValues(0, 0, 0, 0)
    } else {
      const { boardRow, boardCol, sectionRow, sectionCol } = newIndices
      newAreSelected[boardRow][boardCol][sectionRow][sectionCol] = true
      inputRefs[boardRow][boardCol][sectionRow][sectionCol].current?.focus()
      highlightValues(boardRow, boardCol, sectionRow, sectionCol)
    }

    setAreSelected(newAreSelected)
  }, [inputRefs, areSelected, highlightValues])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSolving) return

    const key = e.key.toLowerCase()
    const disabledChars = ['a', 'b', 'o', 'p']
    const disabledArrows = ['arrowup', 'arrowleft']
    let dir: string | undefined

    if (disabledArrows.includes(key) || (e.ctrlKey && disabledChars.includes(key))) {
      e.preventDefault()
    }

    if (key === 'w' || key === 'arrowup' ||( e.ctrlKey && key === 'p')) {
      dir = 'up'
    } else if (key === 's' || key === 'arrowdown' || (e.ctrlKey && key === 'n')) {
      dir = 'down'
    } else if (key === 'a' || key === 'arrowleft' || (e.ctrlKey && key === 'b')) {
      dir = 'left'
    } else if (key === 'd' || key === 'arrowright' || (e.ctrlKey && key === 'f')) {
      dir = 'right'
    }

    if (dir !== undefined) {
      handleMove(dir)
    }
  }, [handleMove, isSolving])

  useEffect(() => {
    if (lastIndices === undefined) return
    const { boardRow, boardCol, sectionRow, sectionCol } = lastIndices
    highlightValues(boardRow, boardCol, sectionRow, sectionCol)
  }, [lastIndices, highlightValues])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  const handleSolveClick = async () => {
    const board = deepCopy4DArr(values)
    if (isValidBoard() && solveSudoku(board)) {
      updateTextColors(board)
      setValues(board)
      setAreSelected(create4DArr(false))
      setLastIndices(undefined)
      await finalizeColors()
    } else {
      alert('This Sudoku board is not solvable!')
      refocus()
    }
  }

  const handleVisualizeClick = async () => {
    const numOfSteps = getNumOfSteps(deepCopy4DArr(values)).step
    let time = TIME
    let step = 1

    const solveSudokuVisualizer = async (board: string[][][][]) => {
      const emptyIndices = getEmptyIndices(board)

      if (emptyIndices === undefined) return true
      const { boardRow, boardCol, sectionRow, sectionCol } = emptyIndices

      for (let num = 1; num <= NUMS; num++) {
        board[boardRow][boardCol][sectionRow][sectionCol] = num.toString()
        const newLastIndices: Indices = {
          boardRow,
          boardCol,
          sectionRow,
          sectionCol
        }
        const newAreSelected = create4DArr(false)
        newAreSelected[boardRow][boardCol][sectionRow][sectionCol] = true

        setValues(deepCopy4DArr(board))
        setLastIndices(newLastIndices)
        setAreSelected(newAreSelected)
        setTransitionTime(time)
        setProgressBarWidth(step++ / numOfSteps)
        await timeout(time)
        time = decrement(time)

        if (isSafe(board, num.toString(), boardRow, boardCol, sectionRow, sectionCol)) {
          if (await solveSudokuVisualizer(board)) {
            return true
          } else {
            board[boardRow][boardCol][sectionRow][sectionCol] = ''
            setValues(deepCopy4DArr(board))
            setLastIndices(newLastIndices)
            setAreSelected(newAreSelected)
            setTransitionTime(time)
            setProgressBarWidth(step++ / numOfSteps)
            await timeout(time)
            time = decrement(time)
          }
        } else {
          board[boardRow][boardCol][sectionRow][sectionCol] = ''
          setValues(deepCopy4DArr(board))
          setTransitionTime(time)
          setProgressBarWidth(step++ / numOfSteps)
          await timeout(time)
          time = decrement(time)
        }
      }

      return false
    }

    if (numOfSteps === 0) {
      setProgressBarWidth(1)
    }
    
    setIsSolving(true)
    setTextColors(textColors
      .map((boardRow, i) => boardRow
      .map((boardCol, j) => boardCol
      .map((sectionRow, k) => sectionRow
      .map((textColor, l) => values[i][j][k][l] === '' ? TEXT_BLUE : textColor)))))
      
    await new Promise(res => setTimeout(res, 0))

    if (isValidBoard() && await solveSudokuVisualizer(deepCopy4DArr(values))) {
      setAreSelected(create4DArr(false))
      setLastIndices(undefined)
      await finalizeColors()      
    } else {
      alert('This Sudoku board is not solvable!')
    }
    setProgressBarWidth(0)
    setTransitionTime(TIME)
    setIsSolving(false)
  }

  const handleResetClick = () => {
    setValues(create4DArr(''))
    setColors(create4DArr(WHITE))
    setAreSelected(create4DArr(false))
    setTextColors(create4DArr(BLACK))
    setLastIndices(undefined)
    setIsSolving(false)
    setProgressBarWidth(0)
    setTransitionTime(TIME)
  }

  const getNewIndices = (boardRow: number, boardCol: number, sectionRow: number, sectionCol: number, dir: string) => {
    switch (dir) {
      case 'up': {
        let inBounds = sectionRow - 1 >= 0
        sectionRow = inBounds ? sectionRow - 1 : SIZE - 1
        if (!inBounds) {
          boardRow = boardRow - 1 >= 0 ? boardRow - 1 : SIZE - 1
        }
        break
      }
      case 'down': {
        let inBounds = sectionRow + 1 < SIZE
        sectionRow = inBounds ? sectionRow + 1 : 0
        if (!inBounds) {
          boardRow = boardRow + 1 < SIZE ? boardRow + 1 : 0
        }
        break
      }
      case 'left': {
        let inBounds = sectionCol - 1 >= 0
        sectionCol = inBounds ? sectionCol - 1 : SIZE - 1
        if (!inBounds) {
          boardCol = boardCol - 1 >= 0 ? boardCol - 1 : SIZE - 1
        }
        break
      }
      case 'right': {
        let inBounds = sectionCol + 1 < SIZE
        sectionCol = inBounds ? sectionCol + 1 : 0
        if (!inBounds) {
          boardCol = boardCol + 1 < SIZE ? boardCol + 1 : 0
        }
        break
      }
    }

    return {
      boardRow,
      boardCol,
      sectionRow,
      sectionCol
    }
  }

  const getNumOfSteps = (board: string[][][][]): { step: number, isSolved: boolean } => {
    const emptyIndices = getEmptyIndices(board)
    
    if (emptyIndices === undefined) return { step: 0, isSolved: true}
    const { boardRow, boardCol, sectionRow, sectionCol } = emptyIndices
    let step = 0
    
    for (let num = 1; num <= NUMS; num++) {
      step++
      if (isSafe(board, num.toString(), boardRow, boardCol, sectionRow, sectionCol)) {
        board[boardRow][boardCol][sectionRow][sectionCol] = num.toString()

        const { step: nextSteps, isSolved } = getNumOfSteps(board)
        step += nextSteps
        if (isSolved) {
          return { step, isSolved: true }
        } else {
          step++
          board[boardRow][boardCol][sectionRow][sectionCol] = ''
        }
      } else {
        step++
      }
    }

    return { step, isSolved: false }
  }

  const isSafe = (board: string[][][][], value: string, boardRow: number, boardCol: number, sectionRow: number, sectionCol: number) => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (i === boardCol && j === sectionCol) continue

        if (board[boardRow][i][sectionRow][j] === value) return false
      }
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (i === boardRow && j === sectionRow) continue

        if (board[i][boardCol][j][sectionCol] === value) return false
      }
    }

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (i === sectionRow && j === sectionCol) continue

        if (board[boardRow][boardCol][i][j] === value) return false
      }
    }

    return true
  }

  const isValidBoard = () => {
    return colors
      .every(boardRow => boardRow
      .every(boardCol => boardCol
      .every(sectionRow => sectionRow
      .every(color => color !== RED))))
  }
  
  const refocus = () => {
    if (lastIndices === undefined) return

    const { boardRow, boardCol, sectionRow, sectionCol } = lastIndices
    inputRefs[boardRow][boardCol][sectionRow][sectionCol].current?.focus()
  }

  const getEmptyIndices = (board: string[][][][]) => {
    let emptyIndices: Indices | undefined

     board
      .every((bRow, i) => bRow
      .every((bCol, j) => bCol
      .every((sRow, k) => sRow
      .every((value, l) => {
        if (value === '') {
          emptyIndices = {
            boardRow: i,
            boardCol: j,
            sectionRow: k,
            sectionCol: l
          }
          return false
        }
        return true
      }))))
    
      return emptyIndices
  }

  const solveSudoku = (board: string[][][][]) => {
    const emptyIndices = getEmptyIndices(board)
        
    if (emptyIndices === undefined) return true
    const { boardRow, boardCol, sectionRow, sectionCol } = emptyIndices

    for (let num = 1; num <= NUMS; num++) {
      if (isSafe(board, num.toString(), boardRow, boardCol, sectionRow, sectionCol)) {
        board[boardRow][boardCol][sectionRow][sectionCol] = num.toString()
        if (solveSudoku(board)) {
          return true
        } else {
          board[boardRow][boardCol][sectionRow][sectionCol] = ''
        }
      }
    }

    return false
  }

  const updateTextColors = (board: string[][][][]) => {
    setTextColors(textColors
      .map((boardRow, i) => boardRow
      .map((boardCol, j) => boardCol
      .map((sectionRow, k) => sectionRow
      .map((textColor, l) => values[i][j][k][l] === board[i][j][k][l] && textColor !== TEXT_BLUE ? BLACK : TEXT_BLUE)))))
  }

  const finalizeColors = async() => {
    const newColors: string[][] = new Array(NUMS).fill(undefined).map(() => new Array(NUMS).fill(WHITE))

    for (let i = 0; i < NUMS; i++) {
      let row = i
      let col = 0

      while (row >= 0) {
        newColors[row--][col++] = LIGHT_GREEN
      }

      setColors(twoDimToFourDim(newColors))
      await timeout(FINALIZE_TIME)
    }

    for (let i = 1; i < NUMS; i++) {
      let row = NUMS - 1
      let col = i

      while (col < NUMS) {
        newColors[row--][col++] = LIGHT_GREEN
      }

      setColors(twoDimToFourDim(newColors))
      await timeout(FINALIZE_TIME)
    }
  }

  const renderSectionRows = (boardRow: number, boardCol: number) => {
    const rows = []

    for (let i = 0; i < SIZE; i++) {
      const blocks = []

      for (let j = 0; j < SIZE; j++) {
        const border: Border = {
          borderTop: i === 0 ? '' : GRAY_BORDER,
          borderLeft: j === 0 ? '' : GRAY_BORDER
        }
            
        const indices: Indices = {
          boardRow,
          boardCol,
          sectionRow: i,
          sectionCol: j
        }

        const key = boardRow * SIZE ** 3 + boardCol * SIZE ** 2 + i * SIZE + j
        const block = <Block
          key={key}
          value={values[boardRow][boardCol][i][j]}
          border={border}
          isChangeable={true}
          indices={indices}
          values={values}
          setValues={setValues}
          inputRef ={inputRefs[boardRow][boardCol][i][j]}
          color={colors[boardRow][boardCol][i][j]}
          textColors={textColors}
          setTextColors={setTextColors}
          areSelected={areSelected}
          setAreSelected={setAreSelected}
          setLastIndices={setLastIndices}
          highlightValues={highlightValues}
          isSolving={isSolving}
        />
        
        blocks.push(block)
      }

      const row = (
        <div
          key={i}
          style={{ display: 'flex' }}
        >
          {blocks.map(cell => cell)}
        </div>
      )

      rows.push(row)
    }

    return (
      <>
        {rows.map(row => row)}
      </>
    )
  }
  
  const renderBoardRows = () => {
    const rows = []

    for (let i = 0; i < SIZE; i++) {
      const sections = []

      for (let j = 0; j < SIZE; j++) {
        const sectionStyle: Border = {
          borderTop: BLACK_BORDER,
          borderLeft: BLACK_BORDER,
          borderBottom: i === SIZE - 1 ? BLACK_BORDER : '',
          borderRight: j === SIZE - 1 ? BLACK_BORDER : '',
        }

        const section = (
          <div
            key={j}
            className='flex-column'
            style={sectionStyle}
          >
            {renderSectionRows(i, j)}
          </div>
        )

        sections.push(section)
      }

      const row = (
        <div
          key={i}
          style={{ display: 'flex' }}
        >
          {sections.map(section => section)}
        </div>
      )

      rows.push(row)
    }

    return (
      <>
        {rows.map(row => row)}
      </>
    )
  }

  const renderBottom = () => {
    if (isSolving) {
      return <ProgressBar
        width={progressBarWidth}
        time={transitionTime}
      />
    } else {
      return (
        <>
          <button onClick={handleSolveClick}>Solve</button>
          <button onClick={handleVisualizeClick}>Visualize</button>
          <button onClick={handleResetClick}>Reset</button>
        </>
      )
    }
  }

  return (
    <div className='container flex-column'>
      <div className='flex-column'>
        {renderBoardRows()}
      </div>
      <div>
        {renderBottom()}
      </div>
    </div>
  )
}

const setInputRefs = () => {
  return new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => createRef<HTMLInputElement>()))))
}

const create4DArr = <T,>(value: T) => {
  return new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(value))))
}

const deepCopy4DArr = <T,>(A: T[][][][]) => {
  return A
    .map(i => i
    .map(j => j
    .map(k => k.slice())))
}

const twoDimToFourDim = (A: string[][]) => {
  const newA = []

  for (let i = 0; i < SIZE; i++) {
    const boardRow = []
    for (let j = 0; j < SIZE; j++) {
      const sectionRows = []
			for (let k = 0; k < SIZE; k++) {
        const sectionRow = []
				for (let l = 0; l < SIZE; l++) {
					sectionRow.push(A[i * SIZE + k][j * SIZE + l])
        }
        sectionRows.push(sectionRow)
      }
      boardRow.push(sectionRows)
    }
    newA.push(boardRow)
  }
  
	return newA
}

const timeout = (time: number) => new Promise(res => setTimeout(res, time))

const decrement = (time: number) => time < MIN_TIME ? MIN_TIME : time - DECREMENT

export default App

export {
  NUMS,
  MAX_LEN,
  create4DArr,
  deepCopy4DArr
}

export type {
  Border,
  Indices
}