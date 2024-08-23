import PatternHeaders from '@/components/tfd/patterns/PatternHeaders';

const commonProps = {
  className: 'attributes zones tiers rounds',
  isStickyHeader: true,
  headerWidths: ['w-1/12', 'w-1/12', 'w-1/12', 'w-1/6', 'w-1/6', 'w-1/6', 'w-1/4'],
  isMaxWidth: true,
  isColumnSticky: true,
} as const;

const TableProps = {
  normal: {
    label: 'Normal',
    headers: PatternHeaders('normal'),
    ...commonProps,
  },
  hard: {
    label: 'Hard',
    headers: PatternHeaders('hard'),
    sublabel: (
      <p className="pb-2 text-center text-lg text-yellow-200 md:text-xl">Patterns marked with * are stealth only</p>
    ),
    ...commonProps,
  },
} as const;

export default TableProps;
