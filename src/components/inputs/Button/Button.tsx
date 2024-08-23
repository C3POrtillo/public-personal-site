import type { ButtonHTMLAttributes, FC } from 'react';

import { joinStrings } from '@/utils/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  error?: boolean;
  size?: 'button-0' | 'button-sm' | 'button-md' | 'button-lg';
  bgColor?: 'bg-neutral-900' | 'bg-neutral-800' | 'bg-neutral-700' | 'bg-neutral-600';
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  selected,
  error,
  disabled,
  size = 'button-lg',
  bgColor = 'bg-neutral-800',
  ...props
}) => (
  <button
    className={joinStrings([
      'tfd-link text-link text-hover input-hover button',
      className,
      bgColor,
      size,
      selected && 'selected',
      disabled && 'disabled',
      error && 'error',
    ])}
    disabled={selected || disabled || error}
    {...props}
  >
    {children}
  </button>
);

export default Button;
