import React from 'react'
import './App.css'

const SIZE = 3
const NUMS = SIZE ** 2

const BLACK_BORDER = '3px solid #000000'
const GRAY_BORDER = '3px solid #bfbfbf'

const App: React.FC = () => {
  const renderBlocks = () => {
    const blocks = []

    for (let i = 0; i < NUMS; i++) {
      for (let j = 0; j < NUMS; j++) {
        const borderTop = i % SIZE === 0 ? BLACK_BORDER : ''
        const borderLeft = j % SIZE === 0 ? BLACK_BORDER : ''
        const borderBottom = i === (NUMS - 1) ? BLACK_BORDER : ''
        const borderRight = j === (NUMS - 1) ? BLACK_BORDER : ''
        const block = (
          <div
            key={i * NUMS + j}
            className='block'
            style={{ borderTop, borderLeft, borderBottom, borderRight }}
          />
        )
        blocks.push(block)
      }
    }

    return blocks
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${NUMS}, 1fr)`
      }}
    >
      {renderBlocks().map(block => block)}
    </div>
  )
}

export default App