import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const use2xlScreen = () => {
  const [screen, isScreen] = useState(true);
  const is2xlScreen = useMediaQuery({ query: '(min-width: 1536px)' });

  useEffect(() => {
    isScreen(is2xlScreen);
  }, []);

  useEffect(() => {
    isScreen(is2xlScreen);
  }, [is2xlScreen]);

  return screen;
};

export default use2xlScreen;
