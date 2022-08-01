import React, { useState } from 'react'
import { NUMS, Border, Indices } from '../App'

const LIGHT_BLUE = '#cfedff'

interface Props {
  value: string;
  border: Border;
  color: string;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
}

const Block: React.FC<Props> = ({ value, border: { borderTop, borderLeft }, color, isChangeable, indices, values, setValues }): JSX.Element => {  
  const [backgroundColor, setBackgroundColor] = useState(color)
  
  function validNumber(numStr: string): boolean {
    const num = Number(numStr)
    return !isNaN(num) && num > 0 && num <= NUMS
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value.trim()
    
    if (newValue === '' || validNumber(newValue)) {
      const newValues = values.slice()
      const { boardRow, boardCol, sectionRow, sectionCol } = indices
      newValues[boardRow][boardCol][sectionRow][sectionCol] = newValue
      setValues(newValues)
    }
  }

  function handleMouseOver() {
    setBackgroundColor(LIGHT_BLUE)
  }

  function handleMouseOut() {
    setBackgroundColor(color)
  }

  return (
    <input
      type='text'
      value={value}
      onChange={isChangeable ? handleChange : undefined}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{
        borderTop,
        borderLeft,
        backgroundColor
      }}
    />
  )
}

export default Block