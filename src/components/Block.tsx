import React from 'react'
import { NUMS, MAX_LEN, Border, Indices, LastValue, create4DArr, deepCopy4DArr } from '../App'
import { LIGHT_BLUE } from '../Colors'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  inputRef: React.RefObject<HTMLInputElement>
  textColor: string;
  colors: string[][][][];
  setColors: React.Dispatch<React.SetStateAction<(string[][][][])>>;
  selectedColors: (string | undefined)[][][][];
  setSelectedColors: React.Dispatch<React.SetStateAction<(string | undefined)[][][][]>>;
  setLastValue: React.Dispatch<React.SetStateAction<LastValue | undefined>>;
}

const Block: React.FC<Props> = ({ border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, inputRef, textColor, colors, setColors, selectedColors, setSelectedColors, setLastValue }): JSX.Element => {
  inputRef.current?.setSelectionRange(MAX_LEN, MAX_LEN)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices

  function getEleFromArr<T>(A: T[][][][]): T {
    return A[boardRow][boardCol][sectionRow][sectionCol]
  }

  function setBackgroundColor() {
    const selectedColor = getEleFromArr(selectedColors)
    const color = getEleFromArr(colors)
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
      setLastValue({
        value,
        boardRow,
        boardCol,
        sectionRow,
        sectionCol
      })
    }
  }

  function handleClick() {
    const newSelectedColors: (string | undefined)[][][][] = create4DArr(undefined)
    newSelectedColors[boardRow][boardCol][sectionRow][sectionCol] = LIGHT_BLUE    
    setSelectedColors(newSelectedColors)
    
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