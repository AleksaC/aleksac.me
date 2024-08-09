import {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

import { Theme, THEME_KEY } from "@/constants/theme";

type ThemeContextType = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

function getDefaultTheme() {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.Dark
    : Theme.Light;
}

function getTheme() {
  return typeof window === "undefined"
    ? Theme.Dark
    : ((localStorage.getItem(THEME_KEY) ?? getDefaultTheme()) as Theme);
}

function toggleTheme(theme: Theme) {
  if (theme === Theme.Dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const ThemeContextProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState(getTheme());

  // Without this other tabs would write to local storage after syncing changes
  // which leads to race conditions when changing the theme rapidly
  const syncedFromStorage = useRef<boolean>(false);

  useEffect(() => {
    setTheme(getTheme());

    const syncStorage = ({ key }: StorageEvent) => {
      if (key === THEME_KEY) {
        const newTheme = getTheme();
        setTheme(newTheme);
        syncedFromStorage.current = true;
      }
    };

    window.addEventListener("storage", syncStorage);

    return () => {
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  useEffect(() => {
    if (!syncedFromStorage.current) {
      localStorage.setItem(THEME_KEY, theme);
    }
    syncedFromStorage.current = false;
    toggleTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
