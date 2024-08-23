import { useEffect, useRef } from 'react';

import type { Dispatch, FC, PropsWithChildren, ReactNode, SetStateAction } from 'react';

import Button from '@/components/inputs/Button/Button';

interface FormProps extends PropsWithChildren {
  label: string | ReactNode;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FormModal: FC<FormProps> = ({ label, children, isOpen, setOpen }) => {
  const modalRef = useRef<HTMLFieldSetElement>(null);

  const toggleForm = () => {
    setOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <Button onClick={toggleForm} size="button-sm">
        {label}
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button className="fixed inset-0 bg-black opacity-50" onClick={toggleForm}></button>

          <fieldset
            className=" relative z-10 max-w-96 rounded-lg border-2 border-black bg-neutral-900 p-2 shadow-md shadow-black"
            ref={modalRef}
          >
            <legend>
              <h2 className="px-2 text-lg xl:text-xl 2xl:text-2xl">{label}</h2>
            </legend>
            <div className="flex flex-col items-center justify-center gap-2">{children}</div>
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default FormModal;
