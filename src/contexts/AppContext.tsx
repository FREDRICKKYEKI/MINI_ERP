import { FC, PropsWithChildren, useContext, createContext } from "react";
interface AppContextProps {
  isSignedIn?: boolean;
  globalState: any;
}

const AppContext = createContext<AppContextProps>({
  globalState: {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider: FC<PropsWithChildren<AppContextProps>> = ({
  children,
  isSignedIn,
  globalState,
}) => {
  const value = {
    isSignedIn,
    globalState,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
