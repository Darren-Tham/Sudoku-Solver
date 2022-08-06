import React, { useState, useEffect } from 'react'
import Block from './components/Block'
import './App.css'

const SIZE = 3
export const NUMS = SIZE ** 2

export const WHITE = '#ffffff'
export const RED = '#ff928a'

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

  useEffect(() => {
    checkValues()
  }, [values])

  useEffect(() => { 
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    const disabledChars = ['a', 'b', 'o', 'p']
    const disabledArrows = ['arrowup', 'arrowleft']

    if (disabledArrows.includes(key) || e.ctrlKey && disabledChars.includes(key)) {
      e.preventDefault()
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
  
  function renderBoardRows () {
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

  function handleClick() {
    console.log(values)
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
  return new Array(SIZE).fill(value)
    .map(() => new Array(SIZE).fill(value)
    .map(() => new Array(SIZE).fill(value)
    .map(() => new Array(SIZE).fill(value))))
}

export default App