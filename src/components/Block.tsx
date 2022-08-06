import React, { useRef } from 'react'
import { NUMS, Border, Indices, Colors } from '../App'

const LIGHT_BLUE = '#cfedff'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  colors: Colors[][][][];
  setColors: React.Dispatch<React.SetStateAction<Colors[][][][]>>;
}

const Block: React.FC<Props> = ({ value, border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, colors, setColors }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const len = value.length
  inputRef.current?.setSelectionRange(len, len)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices

  const { mainColor, selectedColor } = colors[boardRow][boardCol][sectionRow][sectionCol]
  const backgroundColor = selectedColor === undefined ? mainColor : selectedColor

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
    const newColors: Colors[][][][] = colors.slice()
      .map((bRow, i) => bRow
      .map((bCol, j) => bCol
      .map((sRow, k) => sRow
      .map(({ mainColor: currMainColor }, l) => {        
        if (i === boardRow && j === boardCol && k === sectionRow && l === sectionCol) {
          return {
            mainColor: currMainColor,
            selectedColor: LIGHT_BLUE
          }
        } else {
          return {
            mainColor: currMainColor,
            selectedColor: undefined
          }
        }
       }))))
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
        backgroundColor
      }}
      ref={inputRef}
    />
  )
}

export default Block