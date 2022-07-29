import React from 'react'
import './App.css'

const SIZE = 3
const NUMS = SIZE ** 2

const BLACK_BORDER = '3px solid #000000'
const GRAY_BORDER = '3px solid #bfbfbf'

const App: React.FC = () => {
  const renderBlocks = () => {
    const rows = []

    for (let i = 0; i < NUMS; i++) {
      const blocks = []

      for (let j = 0; j < NUMS; j++) {
        const borderTop = i % SIZE === 0 ? BLACK_BORDER : ''
        const borderLeft = j % SIZE === 0 ? BLACK_BORDER : ''
        const borderBottom = i === (NUMS - 1) ? BLACK_BORDER : ''
        const borderRight = j === (NUMS - 1) ? BLACK_BORDER : ''
        const block = (
          <div
            key={j}
            className='block'
            style={{ borderTop, borderLeft, borderBottom, borderRight }}
          />
        )
        blocks.push(block)
      }

      const row = (
        <div
          key={i}
          style={{ display: 'flex' }}
        >
          {blocks.map(block => block)}
        </div>
      )
      rows.push(row)
    }

    return rows
  }

  return (
    <div>
      {renderBlocks().map(row => row)}
    </div>
  )
}

export default App