import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

import type { Dispatch, FC, InputHTMLAttributes, SetStateAction } from 'react';

import { kebabCase } from '@/utils/utils';

type Options = {
  [key: string]: string[] | boolean | string;
};

export interface TextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  setState?: Dispatch<SetStateAction<string>>;
  validate?: (string: string, options?: Options) => boolean;
  labelHidden?: boolean;
}

const Text: FC<TextProps> = ({
  type,
  label,
  name,
  value,
  id = kebabCase(label),
  setState,
  validate,
  required,
  labelHidden,
  className,
  ...props
}) => {
  const [liveValue, setLiveValue] = useState(value as string);
  const [isValid, setValid] = useState(validate?.(liveValue) ?? true);
  const throttledSetState = throttle((newValue: string) => {
    setState?.(newValue);
  }, 250);

  useEffect(() => {
    setLiveValue(value as string);
  }, [value]);

  useEffect(() => {
    throttledSetState(liveValue);

    return () => {
      throttledSetState.cancel();
    };
  }, [liveValue, throttledSetState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLiveValue(e.target.value);
    validate && setValid(validate(liveValue));
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {!labelHidden && (
        <label className="flex text-lg" htmlFor={id}>
          {label}
          {required && '*'}
        </label>
      )}
      <input
        className={[
          'flex w-full rounded-lg border-1 bg-neutral-700 text-2xl shadow-inner shadow-black ring-offset-neutral-800 invalid:border-red-400 focus:ring-1 focus:ring-blue-800',
          isValid ? 'border-black' : 'border-red-400',
          className,
        ].join(' ')}
        type={type || 'text'}
        id={id}
        name={name}
        value={liveValue}
        onChange={handleChange}
        required={required}
        {...props}
      />
    </div>
  );
};

export default Text;
