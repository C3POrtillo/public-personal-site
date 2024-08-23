import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const useLgScreen = () => {
  const [screen, isScreen] = useState(true);
  const isLgScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    isScreen(isLgScreen);
  }, []);

  useEffect(() => {
    isScreen(isLgScreen);
  }, [isLgScreen]);

  return screen;
};

export default useLgScreen;
