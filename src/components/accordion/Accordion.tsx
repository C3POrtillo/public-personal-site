import { useEffect, useRef, useState } from 'react';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { joinStrings } from '@/utils/utils';

interface AccordionProps extends PropsWithChildren {
  className?: string;
  panelClassName?: string;
  label: string | ReactNode;
  icon?: string;
  labelIsClickable?: boolean;
  panelMaxHeight?: number;
  keepOpen?: boolean;
}

const Accordion: FC<AccordionProps> = ({
  className,
  panelClassName,
  label,
  icon,
  children,
  labelIsClickable,
  panelMaxHeight,
  keepOpen,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isClickable] = useState(labelIsClickable || typeof label === 'string');
  const panelRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const panelClasses = joinStrings(['accordion-panel', panelMaxHeight && 'scroll-bar-thin scroll-bar-left']);
  const toggleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!keepOpen && accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      if (panelRef.current && accordionRef.current) {
        panelRef.current.style.maxHeight = `${panelMaxHeight || panelRef.current.scrollHeight + 64}px`;
        panelRef.current.style.overflow = panelMaxHeight ? 'auto' : 'visible';
        panelRef.current.className = [panelClasses, panelClassName || 'gap-4 px-2 py-4'].join(' ');
      }
    } else {
      document.removeEventListener('click', handleClickOutside);
      if (panelRef.current && accordionRef.current) {
        panelRef.current.style.scrollbarGutter = panelMaxHeight ? 'stable' : 'auto';
        panelRef.current.style.maxHeight = '0px';
        panelRef.current.style.overflow = 'hidden';
        panelRef.current.className = joinStrings([panelClasses, !panelClassName && 'px-2']);
      }
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const faIcon = icon || (isOpen ? 'fa-chevron-up' : 'fa-chevron-down');

  return (
    <div ref={accordionRef} className={joinStrings(['flex w-full flex-col', className])}>
      <div className="flex w-full flex-row items-center justify-between">
        {!isClickable && (typeof label === 'string' ? <div className="p-4">{label}</div> : label)}
        <button
          onClick={toggleDropdown}
          className={[
            'bg-hover text-link text-hover inline-flex flex-row items-center justify-between gap-4 p-4',
            isClickable && 'w-full',
          ].join(' ')}
        >
          {isClickable && label}
          <i className={['fa accordion-icon self-center', faIcon].join(' ')} />
        </button>
      </div>
      <div ref={panelRef} className={panelClasses}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
