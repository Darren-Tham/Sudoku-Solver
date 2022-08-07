import React from 'react'
import { NUMS, MAX_LEN, LIGHT_BLUE, Border, Indices, Colors, deepCopy4DArr } from '../App'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  colors: Colors[][][][];
  setColors: React.Dispatch<React.SetStateAction<Colors[][][][]>>;
  inputRef: React.RefObject<HTMLInputElement>
}

const Block: React.FC<Props> = ({ border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, colors, setColors, inputRef }): JSX.Element => {
  inputRef.current?.setSelectionRange(MAX_LEN, MAX_LEN)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices
  const { mainColor, selectedColor, textColor: color } = colors[boardRow][boardCol][sectionRow][sectionCol]
  const backgroundColor = selectedColor === undefined ? mainColor : selectedColor

  function validNumber(numStr: string): boolean {
    const num = Number(numStr)
    return num > 0 && num <= NUMS
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = e.target

    if (value.includes(' ') || value.includes('.')) return

    if (value.length > MAX_LEN) {
      value = value.at(-1) as string
    }

    if (value === '' || validNumber(value)) {
      const newValues = deepCopy4DArr(values)
      newValues[boardRow][boardCol][sectionRow][sectionCol] = value
      setValues(newValues)
    }
  }

  function handleClick() {
    const newColors: Colors[][][][] = colors.slice()
      .map((bRow, i) => bRow
      .map((bCol, j) => bCol
      .map((sRow, k) => sRow
      .map(({ mainColor: currMainColor, textColor: currTextColor }, l) => {        
        if (i === boardRow && j === boardCol && k === sectionRow && l === sectionCol) {
          return {
            mainColor: currMainColor,
            selectedColor: LIGHT_BLUE,
            textColor: currTextColor
          }
        } else {
          return {
            mainColor: currMainColor,
            selectedColor: undefined,
            textColor: currTextColor
          }
        }
      }))))
       
    setColors(newColors)
  }

  return (
    <input
      type='text'
      value={values[boardRow][boardCol][sectionRow][sectionCol]}
      onChange={isChangeable ? handleChange : undefined}
      onClick={handleClick}
      style={{
        borderTop,
        borderLeft,
        backgroundColor,
        color
      }}
      ref={inputRef}
    />
  )
}

export default Block