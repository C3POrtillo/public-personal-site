/* eslint-disable tailwindcss/no-custom-classname */
import { useEffect, useRef, useState } from 'react';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { joinStrings } from '@/utils/utils';

interface DropdownProps extends PropsWithChildren {
  label: string | ReactNode;
  hasIcon?: boolean;
  icon?: ReactNode;
  labelIsMaxWidth?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ label, children, hasIcon = true, icon, labelIsMaxWidth }) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerClasses = 'dropdown-panel absolute z-10 w-full min-w-max gap-4 rounded-xl lg:w-auto';

  const toggleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      if (panelRef.current && dropdownRef.current) {
        panelRef.current.style.maxHeight = `${panelRef.current.scrollHeight + 64}px`;
        panelRef.current.style.overflow = 'visible';
        panelRef.current.className = [
          containerClasses,
          'border-2 border-black bg-neutral-800 p-4 shadow-lg shadow-black',
        ].join(' ');

        setTimeout(() => {
          panelRef?.current?.classList.remove('text-hidden');
          panelRef?.current?.classList.add('text-visible');
        }, 100);
      }
    } else {
      document.removeEventListener('click', handleClickOutside);
      if (panelRef.current && dropdownRef.current) {
        panelRef.current.style.maxHeight = '0px';
        panelRef.current.style.overflow = 'hidden';
        panelRef.current.className = containerClasses;
        panelRef.current.classList.remove('text-visible');
        panelRef.current.classList.add('text-hidden');
      }
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={joinStrings([
        'bg-hover relative flex w-full items-center justify-center rounded-lg text-left align-middle',
        isOpen && 'bg-neutral-400',
      ])}
    >
      <button
        onClick={toggleDropdown}
        className="text-link text-hover flex w-full justify-between gap-4 rounded-md px-4"
      >
        <div className={joinStrings(['text-nowrap', labelIsMaxWidth && 'w-full'])}>{label}</div>
        {hasIcon &&
          (icon || (
            <i className={['fa link-icon self-center', isOpen ? 'fa-chevron-up' : 'fa-chevron-down'].join(' ')} />
          ))}
      </button>
      {children && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          ref={panelRef}
          style={{
            top: `${(dropdownRef?.current?.offsetHeight || 0) + 8}px`,
          }}
        >
          <div className="flex min-h-max w-full min-w-min flex-col">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
