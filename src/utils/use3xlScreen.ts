import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const use3xlScreen = () => {
  const [screen, isScreen] = useState(true);
  const is3xlScreen = useMediaQuery({ query: '(min-width: 2160px)' });

  useEffect(() => {
    isScreen(is3xlScreen);
  }, []);

  useEffect(() => {
    isScreen(is3xlScreen);
  }, [is3xlScreen]);

  return screen;
};

export default use3xlScreen;
