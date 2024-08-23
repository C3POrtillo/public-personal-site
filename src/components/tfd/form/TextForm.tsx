import type { TextProps } from '@/components/inputs/Text/Text';
import type { FC } from 'react';

import Button from '@/components/inputs/Button/Button';
import Text from '@/components/inputs/Text/Text';
import { joinStrings } from '@/utils/utils';

interface TextFormProps extends TextProps {
  error?: boolean;
  handleButton?: (() => Promise<void>) | (() => void);
  buttonLabel?: string;
  isReversed?: boolean;
  buttonDisabled?: boolean;
}

const TextForm: FC<TextFormProps> = ({ buttonLabel, buttonDisabled, handleButton, error, isReversed, ...props }) => {
  const button = buttonLabel && (
    <div className="min-w-32">
      <Button onClick={handleButton} disabled={buttonDisabled}>
        {buttonLabel}
      </Button>
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center gap-2 md:flex-row">
      {isReversed && button}
      <div
        className={joinStrings([
          'w-full rounded-xl border-2 bg-neutral-800 p-2 shadow-md shadow-black',
          buttonLabel && ' md:min-w-96',
          error ? 'border-red-400' : 'border-black',
        ])}
      >
        <Text {...props} />
      </div>
      {!isReversed && button}
    </div>
  );
};

export default TextForm;
