import React, { useState, useEffect } from 'react'
import Block from './components/Block'
import './App.css'

const SIZE = 3
export const NUMS = SIZE ** 2

const BLACK_BORDER = '3px solid #000000'
const GRAY_BORDER = '1.5px solid #bfbfbf'

export interface Border {
  borderTop: string;
  borderLeft: string;
  borderBottom?: string;
  borderRight?: string;
}

export interface Indices {
  boardRow: number,
  boardCol: number,
  sectionRow: number,
  sectionCol: number
}

const App: React.FC = (): JSX.Element => {
  const [blocks, setBlocks] = useState<JSX.Element[]>([])
  const [board, setBoard] = useState<string[][][][]>([])

  useEffect(() => {  
    setInitialState()
  }, [])

  function setInitialState(): void {
    const initialBlocks = []
    const initialBoard = new Array(SIZE).fill('')
      .map(() => new Array(SIZE).fill('')
      .map(() => new Array(SIZE).fill('')
      .map(() => new Array(SIZE).fill(''))))
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        for (let k = 0; k < SIZE; k++) {
          for (let l = 0; l < SIZE; l++) {
            const style: Border = {
              borderTop: k === 0 ? '' : GRAY_BORDER,
              borderLeft: l === 0 ? '' : GRAY_BORDER
            }

            const id = i * SIZE ** 3 + j * SIZE ** 2 + k * SIZE + l
            const indices: Indices = {
              boardRow: i,
              boardCol: j,
              sectionRow: k,
              sectionCol: l
            }

            const block = <Block
              key={id}
              id={id.toString()}
              val=''
              style={style}
              isChangeable={true}
              indices={indices}
              board={initialBoard}
              setBoard={setBoard}
            />

            initialBlocks.push(block)
          }
        }
      }
    }

    setBlocks(initialBlocks)
    setBoard(initialBoard)
  }
  
  function getSectionRows (boardRow: number, boardCol: number): JSX.Element[] {
    const rows = []

    for (let i = 0; i < SIZE; i++) {
      const cells = []

      for (let j = 0; j < SIZE; j++) {
        const idx = boardRow * SIZE ** 3 + boardCol * SIZE ** 2 + i * SIZE + j
        cells.push(blocks[idx])
      }

      const row = (
        <div
          key={i}
          style={{ display: 'flex' }}
        >
          {cells.map(cell => cell)}
        </div>
      )

      rows.push(row)
    }

    return rows
  }
  
  function getBoardRows (): JSX.Element[] {
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
            {getSectionRows(i, j).map(sectionRow => sectionRow)}
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

    return rows
  }

  function handleClick() {
    console.log(board)
  }

  return (
    <div
      className='container flex-column'
    >
      {getBoardRows().map(row => row)}
      <div
        className='buttons flex-column'
      >
        <button
          onClick={handleClick}
        >
          Solve
        </button>
        <button
        >Visualize</button>
      </div>
    </div>
  )
}

export default App