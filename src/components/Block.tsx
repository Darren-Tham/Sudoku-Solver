import React from 'react'
import { NUMS, MAX_LEN, Border, Indices, deepCopy4DArr } from '../App'
import { LIGHT_BLUE } from '../Colors'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  inputRef: React.RefObject<HTMLInputElement>
  color: string;
  textColor: string;
  selectedColors: (string | undefined)[][][][];
  setSelectedColors: React.Dispatch<React.SetStateAction<(string | undefined)[][][][]>>;
}

const Block: React.FC<Props> = ({ border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, inputRef, color, textColor, selectedColors, setSelectedColors }): JSX.Element => {
  inputRef.current?.setSelectionRange(MAX_LEN, MAX_LEN)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices

  function getEleFromArr<T>(A: T[][][][]): T {
    return A[boardRow][boardCol][sectionRow][sectionCol]
  }

  function setBackgroundColor() {
    const selectedColor = getEleFromArr(selectedColors)
    return selectedColor === undefined ? color : selectedColor
  }

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
    setSelectedColors(selectedColors
      .map((bRow, i) => bRow
      .map((bCol, j) => bCol
      .map((sRow, k) => sRow
      .map((_, l) => {
        if (i === boardRow && j === boardCol && k === sectionRow && l === sectionCol) {
          return LIGHT_BLUE
        }
        return undefined
      })))))
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
        backgroundColor: setBackgroundColor(),
        color: textColor
      }}
      ref={inputRef}
    />
  )
}

export default Block