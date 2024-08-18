import { THEME_KEY } from "./config";

export const setInitialTheme = () => {
  if (
    localStorage.getItem(THEME_KEY) === "dark" ||
    (!(THEME_KEY in localStorage) &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(THEME_KEY, "light");
  }
};

setInitialTheme();

const observer = new MutationObserver(setInitialTheme);
observer.observe(document.documentElement, {
  childList: true,
  subtree: false,
});
