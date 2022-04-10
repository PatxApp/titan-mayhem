import React from 'react'
import cc from 'classcat'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const Button = ({
  disabled,
  variant,
  onClick,
  className,
  children,
}: React.PropsWithChildren<ButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className={cc([
        'button',
        `button--${variant}`,
        disabled && `button--disabled`,
        className,
      ])}
    >
      {children}
    </button>
  )
}

export default Button
