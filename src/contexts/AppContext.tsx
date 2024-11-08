import { FC, PropsWithChildren, useContext, createContext } from "react";
interface AppContextProps {
  isSignedIn?: boolean;
}

const AppContext = createContext<AppContextProps>({});
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: FC<PropsWithChildren<AppContextProps>> = ({
  children,
  isSignedIn,
}) => {
  const value = {
    isSignedIn,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
