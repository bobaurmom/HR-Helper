import { createContext, useContext } from 'react';

const NavigationContext = createContext(null);

export function NavigationProvider({ children, value }) {
  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
