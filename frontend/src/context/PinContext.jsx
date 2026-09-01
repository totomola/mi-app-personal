import { createContext, useContext, useState } from 'react';

const PinContext = createContext();

export function PinProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  function unlock() {
    setUnlocked(true);
  }

  function lock() {
    setUnlocked(false);
  }

  return (
    <PinContext.Provider value={{ unlocked, unlock, lock }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePin() {
  return useContext(PinContext);
}