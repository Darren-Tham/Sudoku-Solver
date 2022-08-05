import React, { useRef } from 'react'
import { NUMS, WHITE, RED, Border, Indices } from '../App'

const LIGHT_BLUE = '#cfedff'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  colors: string[][][][];
  setColors: React.Dispatch<React.SetStateAction<string[][][][]>>;
}

const Block: React.FC<Props> = ({ value, border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, colors, setColors }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const len = value.length
  inputRef.current?.setSelectionRange(len, len)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices

  function validNumber(numStr: string): boolean {
    const num = Number(numStr)
    return num > 0 && num <= NUMS
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value

    if (newValue.includes(' ') || newValue.includes('.')) return

    if (newValue === '' || validNumber(newValue)) {
      const newValues = values.slice()
      newValues[boardRow][boardCol][sectionRow][sectionCol] = newValue
      setValues(newValues)
    }
  }

  function handleClick() {
    const newColors: string[][][][] = colors.slice().map(i => i
      .map(j => j
      .map(k => k
      .map(currColor => currColor === RED ? RED : WHITE))))
    newColors[boardRow][boardCol][sectionRow][sectionCol] = LIGHT_BLUE
    setColors(newColors)
  }

  return (
    <input
      type='text'
      value={value}
      onChange={isChangeable ? handleChange : undefined}
      onClick={handleClick}
      style={{
        borderTop,
        borderLeft,
        backgroundColor: colors[boardRow][boardCol][sectionRow][sectionCol]
      }}
      ref={inputRef}
    />
  )
}

export default Block