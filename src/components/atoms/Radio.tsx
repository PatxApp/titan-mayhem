import React from 'react'
import cc from 'classcat'

interface RadioProps {
  className?: string
  checked?: boolean
  disabled?: boolean
  toggle?: () => void
}

const Radio = ({ className, checked, disabled, toggle }: RadioProps) => (
  <label
    className={cc([
      'form__radio',
      disabled && 'form__radio--disabled',
      checked && 'form__radio--checked',
      className,
    ])}
  >
    <input type='radio' checked={checked} readOnly={true} />
    <div className={cc(['form__radio__custom'])} onClick={toggle}></div>
  </label>
)

export default Radio
