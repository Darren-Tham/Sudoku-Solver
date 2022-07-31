import React, { useState } from 'react'
import { NUMS, Border, Indices } from '../App'

interface Props {
  id: string;
  val: string;
  style: Border;
  isChangeable: boolean;
  indices: Indices;
  board: string[][][][];
  setBoard: React.Dispatch<React.SetStateAction<string[][][][]>>;
}

const Block: React.FC<Props> = ({ id, val, style, isChangeable, indices, board, setBoard }): JSX.Element => {  
  const [value, setValue] = useState(val)
  
  function validNumber(numStr: string): boolean {
    const num = Number(numStr)
    return !isNaN(num) && num > 0 && num <= NUMS
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value.trim()
    
    if (newValue === '' || validNumber(newValue)) {
      const { boardRow, boardCol, sectionRow, sectionCol } = indices
      const newBoard = board.slice()
      newBoard[boardRow][boardCol][sectionRow][sectionCol] = newValue
      setBoard(newBoard)
      setValue(newValue)
    }
  }

  return (
    <input
      id={id}
      value={value}
      onChange={isChangeable ? handleChange : undefined}
      style={style}
    />
  )
}

export default Block