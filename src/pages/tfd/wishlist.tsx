import { useEffect, useState } from 'react';

import type { FilterOptionsData } from '@/components/inputs/types';
import type { BlueprintFilterMap, BlueprintTypes, MissionFilterMap, Pattern } from '@/components/tfd/patterns/types';
import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import AccordionContained from '@/components/accordion/AccordionContained';
import Container from '@/components/container/Container';
import Button from '@/components/inputs/Button/Button';
import FilterOptions from '@/components/inputs/Checkbox/FilterOptions';
import Table from '@/components/table/Table';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import Footer from '@/components/tfd/footer/Footer';
import TextForm from '@/components/tfd/form/TextForm';
import Header from '@/components/tfd/header/Header';
import PatternRow from '@/components/tfd/patterns/PatternRow';
import TableProps from '@/components/tfd/patterns/TableProps';
import { enhanceFilters, hardPatterns, missionOptions, normalPatterns } from '@/components/tfd/patterns/types';
import { createFilters, filterAndSortPatterns } from '@/components/tfd/patterns/utils';
import { exportData, getTfdSeo, importData } from '@/utils/utils';

interface WishlistProps {
  missionFilterMap: MissionFilterMap;
  itemFilterMap: BlueprintFilterMap;
  descendantOptions: FilterOptionsData[];
  weaponOptions: FilterOptionsData[];
  enhanceOptions: FilterOptionsData[];
  normalPatternData: Pattern[];
  hardPatternData: Pattern[];
  seo: NextSeoProps;
}

const Wishlist: FC<WishlistProps> = ({
  missionFilterMap,
  itemFilterMap,
  descendantOptions,
  weaponOptions,
  enhanceOptions,
  normalPatternData,
  hardPatternData,
  seo,
}) => {
  const { isAuthenticated } = useAuth();
  const [isComponent, setComponent] = useState('set-wishlist');
  const [missionFilter, setMissionFilter] = useState(missionFilterMap);
  const [itemFilter, setItemFilter] = useState(itemFilterMap);
  const [importName, setImportName] = useState('');
  const [saveName, setSaveName] = useState('');
  const [exportName, setExportName] = useState('');
  const [errorImport, setImportError] = useState(false);
  const [errorExport, setExportError] = useState(false);
  const [errorCopy, setCopyError] = useState(false);
  const [allPatterns, setAllPatterns] = useState({
    normal: normalPatternData,
    hard: hardPatternData,
  });
  const [filteredPatterns, setFilteredPatterns] = useState(allPatterns);
  const [savedData, setSavedData] = useState([] as { name: string; data: BlueprintFilterMap }[]);
  const [isExportRecent, setExportRecent] = useState(true);

  useEffect(() => {
    const getAuthCookie = () => {
      const cookies = document.cookie.split('; ').filter(cookie => !cookie.startsWith('auth='));
      cookies.forEach(cookie => {
        const [item, boolean] = cookie.split('=');
        itemFilter[item as BlueprintTypes] = Boolean(boolean);
      });

      return setItemFilter({ ...itemFilter });
    };

    getAuthCookie();
  }, []);

  useEffect(() => {
    setFilteredPatterns({
      normal: filterAndSortPatterns(normalPatternData, { missionFilter, itemFilter }),
      hard: filterAndSortPatterns(hardPatternData, { missionFilter, itemFilter }),
    });

    Object.entries(itemFilter).forEach(([item, boolean]) => {
      if (boolean) {
        document.cookie = `${item}=${encodeURIComponent(boolean)}; path=/tfd/wishlist; max-age=${60 * 60 * 24 * 30}`;
      } else {
        document.cookie = `${item}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/tfd/wishlist;`;
      }
    });
  }, [itemFilter, missionFilter]);
  useEffect(() => {
    setAllPatterns({
      normal: filterAndSortPatterns(normalPatternData, { missionFilter, isAll: true }),
      hard: filterAndSortPatterns(hardPatternData, { missionFilter, isAll: true }),
    });
  }, [missionFilter]);

  const handleImport = () =>
    importData('import-wishlist', { saveName: importName }, { setData: setItemFilter, setError: setImportError });
  const handleExport = async () =>
    saveName &&
    (await exportData('export-wishlist', { saveName, ...isAuthenticated }, itemFilter, {
      setName: setExportName,
      setError: setExportError,
    })) &&
    setExportRecent(true);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportName);
    } catch (error) {
      setCopyError(true);
    }
  };

  const isSaved = isComponent === 'saved';
  const isWishlist = isComponent === 'set-wishlist';
  const isFilter = isComponent === 'view-wishlist';
  const isPattern = isComponent === 'patterns';

  const tabOptions = [
    {
      label: 'Saved Wishlists',
      value: 'saved',
      selected: isSaved,
      disabled: !isAuthenticated,
      onClick: async () => {
        setComponent('saved');
        if (!isExportRecent || !isAuthenticated) {
          return;
        }
        const res = await importData('import-all-wishlists', isAuthenticated, { type: 'all' });
        if (res) {
          setSavedData(
            (res as Record<string, string>[]).map(({ id, name, data }) => ({
              name: `${id}-${name}`,
              data: JSON.parse(data),
            })),
          );
          setExportRecent(false);
        }
      },
    },
    {
      label: 'Set Wishlist',
      value: 'set-wishlist',
      selected: isWishlist,
    },
    {
      label: 'View Wishlist',
      value: 'view-wishlist',
      selected: isFilter,
    },
    {
      label: 'All Patterns',
      value: 'patterns',
      selected: isPattern,
    },
  ];

  const DataOptions = [
    {
      label: 'Load',
      placeholder: 'Paste share code here',
      value: '',
      buttonLabel: 'Load',
      handleButton: handleImport,
      buttonDisabled: !importName,
      setState: setImportName,
      error: errorImport,
    },
    {
      label: 'Save Name',
      placeholder: 'Max 10 characters',
      value: '',
      buttonLabel: 'Save',
      handleButton: handleExport,
      buttonDisabled: !saveName,
      setState: setSaveName,
      error: errorExport,
      maxLength: 10,
    },
    {
      label: 'Share Code',
      disabled: true,
      error: errorCopy,
      value: exportName,
      buttonLabel: 'Copy',
      handleButton: handleCopy,
      buttonDisabled: !exportName,
    },
  ] as const;

  return (
    <>
      <Header seo={seo} />
      <Container>
        <div className="flex w-full flex-col justify-center gap-2 self-center md:w-min">
          <div className="flex w-full flex-col gap-2 lg:w-min lg:flex-row">
            {tabOptions.map(({ label, value, selected, disabled, onClick = () => setComponent(value) }) => (
              <Button key={value} onClick={onClick} selected={selected} disabled={disabled}>
                {label}
              </Button>
            ))}
          </div>
          <AccordionContained label="Save/Load" keepOpen>
            <div className="flex w-full flex-col items-center gap-2">
              {DataOptions.map(options => (
                <TextForm key={options.label} {...options} />
              ))}
            </div>
          </AccordionContained>
        </div>
      </Container>
      <Container className={!isWishlist ? 'hidden' : undefined}>
        <div className="attributes zones tiers rounds flex flex-row flex-wrap items-start gap-2 md:gap-3 xl:gap-5">
          <FilterOptions filterOptions={descendantOptions} filter={itemFilter} setFilter={setItemFilter} />
          <FilterOptions filterOptions={weaponOptions} filter={itemFilter} setFilter={setItemFilter} />
          <FilterOptions filterOptions={enhanceOptions} filter={itemFilter} setFilter={setItemFilter} />
        </div>
      </Container>
      {isAuthenticated && isSaved && (
        <Container>
          <div className="flex flex-row flex-wrap gap-2">
            {savedData.length ? (
              savedData.map(({ name, data }, index) => (
                <Button key={[name, index].join('-')} onClick={() => setItemFilter(data)}>
                  {name}
                </Button>
              ))
            ) : (
              <span className="text-center">Loading...</span>
            )}
          </div>
        </Container>
      )}
      {(isFilter || isPattern) && (
        <>
          <Container>
            <div>
              <FilterOptions
                filterOptions={missionOptions}
                filter={missionFilter}
                setFilter={setMissionFilter}
                checkboxContainerClasses="grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row"
              />
            </div>
          </Container>
          {(['normal', 'hard'] as const).map(mode => (
            <Container key={mode}>
              <Table
                body={(isFilter ? filteredPatterns[mode] : allPatterns[mode]).map(data => (
                  <PatternRow key={data.pattern + data.variant} data={data} itemFilter={itemFilter} />
                ))}
                {...TableProps[mode]}
              />
            </Container>
          ))}
        </>
      )}
      <Footer />
    </>
  );
};

export const getStaticProps = (async () => {
  const title = 'Wishlist | The First Descendant';
  const description = `Tool for filtering or wishlisting blueprints in The First Descedant (TFD). 
    Filters patterns based on selected blueprints and mission type. 
    Contains all patterns and pattern data. Users can save/load wishlists using share codes.`;
  const slug = '/wishlist';

  return {
    props: {
      enhanceOptions: enhanceFilters,
      normalPatternData: normalPatterns,
      hardPatternData: hardPatterns,
      ...createFilters(),
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default Wishlist;
