import React, { useState, useEffect, createRef } from 'react'
import Block from './components/Block'
import './App.css'

const SIZE = 3
export const NUMS = SIZE ** 2

export const WHITE = '#ffffff'
export const RED = '#ff928a'
export const LIGHT_BLUE = '#cfedff'

const BLACK_BORDER = '3px solid #000000'
const GRAY_BORDER = '1.5px solid #bfbfbf'

export interface Border {
  borderTop: string;
  borderLeft: string;
  borderBottom?: string;
  borderRight?: string;
}

interface UniqueValues {
  [key: string]: true;
}

export interface Indices {
  boardRow: number;
  sectionRow: number;
  boardCol: number;
  sectionCol: number;
}

export interface Colors {
  mainColor: string;
  selectedColor: string | undefined;
}

const App: React.FC = () => {

  const [values, setValues] = useState<string[][][][]>(create4DArr<string>(''))
  const [colors, setColors] = useState<Colors[][][][]>(create4DArr<Colors>({
    mainColor: WHITE,
    selectedColor: undefined
  }))
  const [inputRefs] = useState<React.RefObject<HTMLInputElement>[][][][]>(setInputRefs())

  useEffect(() => checkValues(), [values])

  useEffect(() => { 
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [colors])

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    const disabledChars = ['a', 'b', 'o', 'p']
    const disabledArrows = ['arrowup', 'arrowleft']

    if (disabledArrows.includes(key) || e.ctrlKey && disabledChars.includes(key)) {
      e.preventDefault()
    }

    switch (key) {
      case 'arrowup':
      case 'arrowdown':
      case 'arrowleft':
      case 'arrowright':
        handleMove(key)
        break
    }
  }

  function handleMove(key: string) {
    let newIndices: Indices | undefined

    const newColors: Colors[][][][] = colors.slice()
      .map((boardRow, i) => boardRow
      .map((boardCol, j) => boardCol
      .map((sectionRow, k) => sectionRow
      .map(({ mainColor, selectedColor}, l) => {
        if (selectedColor !== undefined) {
          newIndices = getNewIndices(i, j, k, l, key)          
        }

        return {
          mainColor,
          selectedColor: undefined
        }
      }))))
    
    if (newIndices === undefined) {
      newColors[0][0][0][0] = {
        mainColor: newColors[0][0][0][0].mainColor,
        selectedColor: LIGHT_BLUE
      }
      inputRefs[0][0][0][0].current?.focus()
    } else {
      console.table(newIndices)
      const { boardRow, boardCol, sectionRow, sectionCol } = newIndices
      newColors[boardRow][boardCol][sectionRow][sectionCol] = {
        mainColor: newColors[boardRow][boardCol][sectionRow][sectionCol].mainColor,
        selectedColor: LIGHT_BLUE
      }
      inputRefs[boardRow][boardCol][sectionRow][sectionCol].current?.focus()
    }

    setColors(newColors)
  }

  function handleClick() {
    console.log(colors)
  }

  function setInputRefs() {
    return new Array(SIZE).fill(undefined)
      .map(() => new Array(SIZE).fill(undefined)
      .map(() => new Array(SIZE).fill(undefined)
      .map(() => new Array(SIZE).fill(undefined)
      .map(() => createRef<HTMLInputElement>()))))
  }

  function getNewIndices(boardRow: number, boardCol: number, sectionRow: number, sectionCol: number, key: string) {
    switch (key) {
      case 'arrowup': {
        let inBounds = sectionRow - 1 >= 0
        sectionRow = inBounds ? sectionRow - 1 : SIZE - 1
        if (!inBounds) {
          boardRow = boardRow - 1 >= 0 ? boardRow - 1 : SIZE - 1
        }
        break
      }
      case 'arrowdown': {
        let inBounds = sectionRow + 1 < SIZE
        sectionRow = inBounds ? sectionRow + 1 : 0
        if (!inBounds) {
          boardRow = boardRow + 1 < SIZE ? boardRow + 1 : 0
        }
        break
      }
      case 'arrowleft': {
        let inBounds = sectionCol - 1 >= 0
        sectionCol = inBounds ? sectionCol - 1 : SIZE - 1
        if (!inBounds) {
          boardCol = boardCol - 1 >= 0 ? boardCol - 1 : SIZE - 1
        }
        break
      }
      case 'arrowright': {
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

  function getInvalidRows() {
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

    return invalidRows
  }

  function getInvalidCols() {
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

    return invalidCols
  }

  function getInvalidSections() {
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

    return invalidSections
  }

  function checkValues() {
    const newColors = colors.slice()
      .map(boardRow => boardRow
      .map(boardCol => boardCol
      .map(sectionRow => sectionRow
      .map(({ selectedColor }) => ({
          mainColor: WHITE,
          selectedColor
      })))))

    getInvalidRows().forEach(row => {
      const { boardRow, sectionRow } = row
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const { selectedColor } = newColors[boardRow][i][sectionRow][j]          
          newColors[boardRow][i][sectionRow][j] = {
            mainColor: RED,
            selectedColor
          }
        }
      }
    })

    getInvalidCols().forEach(col => {
      const { boardCol, sectionCol } = col
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const { selectedColor } = newColors[i][boardCol][j][sectionCol]
          newColors[i][boardCol][j][sectionCol] = {
            mainColor: RED,
            selectedColor
          }
        }
      }
    })

    getInvalidSections().forEach(section => {
      const { boardRow, boardCol } = section
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const { selectedColor } = newColors[boardRow][boardCol][i][j]
          newColors[boardRow][boardCol][i][j] = {
            mainColor: RED,
            selectedColor
          }
        }
      }
    })

    setColors(newColors)
  }

  function renderSectionRows (boardRow: number, boardCol: number) {
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
          colors={colors}
          setColors={setColors}
          inputRef ={inputRefs[boardRow][boardCol][i][j]}
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
  
  function renderBoardRows() {
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

  return (
    <div className='container flex-column'>
      {renderBoardRows()}
      <div className='buttons flex-column'>
        <button onClick={handleClick}>Solve</button>
        <button>Visualize</button>
      </div>
    </div>
  )
}

function create4DArr<T>(value: T): T[][][][] {
  return new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(undefined)
    .map(() => new Array(SIZE).fill(value))))
}

export default App