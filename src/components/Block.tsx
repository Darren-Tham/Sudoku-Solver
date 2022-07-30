import React, { useState } from 'react'
import { NUMS, Border } from '../App'

interface Props {
  id: string,
  val: string,
  style: Border,
  inputRef: React.RefObject<HTMLInputElement>
  isChangeable: boolean
}

const Block: React.FC<Props> = ({ id, val, style, inputRef, isChangeable }): JSX.Element => {
  const [value, setValue] = useState(val)

  function validNumber(numStr: string): boolean {
    const num = Number(numStr)
    return !isNaN(num) && num > 0 && num <= NUMS
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value.trim()

    if (newValue === '' || validNumber(newValue)) {
      setValue(newValue)
    }
  }

  return (
    <input
      id={id}
      value={value}
      onChange={isChangeable ? handleChange : undefined}
      style={style}
      ref={inputRef}
    />
  )
}

export default Block