import React from 'react';
import Loading from '../components/Loading';

const LoadingScreen = () => {
  let synchronizationEnded = false;
  return (
    <Loading
      text="Načítání dat..."
      loadingFailed={synchronizationEnded}
      errorMessage="Někde nastala chyba při načítání událostí. Zkuste to prosím později."
    />
  );
};

export default LoadingScreen;
