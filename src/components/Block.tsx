import { NUMS, MAX_LEN, Border, Indices, create4DArr, deepCopy4DArr } from '../App'
import { BLACK, BLUE } from '../Colors'

interface Props {
  value: string;
  border: Border;
  isChangeable: boolean;
  indices: Indices;
  values: string[][][][];
  setValues: React.Dispatch<React.SetStateAction<string[][][][]>>;
  inputRef: React.RefObject<HTMLInputElement>
  color: string
  textColors: string[][][][];
  setTextColors: React.Dispatch<React.SetStateAction<string[][][][]>>;
  areSelected: boolean[][][][];
  setAreSelected: React.Dispatch<React.SetStateAction<boolean[][][][]>>;
  setLastIndices: React.Dispatch<React.SetStateAction<Indices | undefined>>;
  isSolving: boolean
}

const Block: React.FC<Props> = ({ border: { borderTop, borderLeft }, isChangeable, indices, values, setValues, inputRef, color, textColors, setTextColors, areSelected, setAreSelected, setLastIndices, isSolving }): JSX.Element => {
  inputRef.current?.setSelectionRange(MAX_LEN, MAX_LEN)

  const { boardRow, boardCol, sectionRow, sectionCol } = indices

  const setBackgroundColor = () => areSelected[boardRow][boardCol][sectionRow][sectionCol] ? BLUE : color

  const validNumber = (value: string) => {
    const num = Number(value)
    return num > 0 && num <= NUMS
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target

    if (value.includes(' ') || value.includes('.')) return

    if (value.length > MAX_LEN) {
      value = value.at(-1) as string
    }

    if (value === '' || validNumber(value)) {
      const newValues = deepCopy4DArr(values)
      const newTextColors = deepCopy4DArr(textColors)
      newValues[boardRow][boardCol][sectionRow][sectionCol] = value
      newTextColors[boardRow][boardCol][sectionRow][sectionCol] = BLACK

      setValues(newValues)
      setTextColors(newTextColors)
    }
  }

  const handleClick = () => {
    const newAreSelected = create4DArr(false)
    newAreSelected[boardRow][boardCol][sectionRow][sectionCol] = true

    setAreSelected(newAreSelected)
    setLastIndices({
      boardRow,
      boardCol,
      sectionRow,
      sectionCol
    })
  }

  return (
    <input
      type='text'
      value={values[boardRow][boardCol][sectionRow][sectionCol]}
      onChange={isChangeable ? handleChange : undefined}
      onClick={isSolving ? undefined : handleClick}
      style={{
        borderTop,
        borderLeft,
        backgroundColor: setBackgroundColor(),
        color: textColors[boardRow][boardCol][sectionRow][sectionCol]
      }}
      ref={inputRef}
    />
  )
}

export default Block