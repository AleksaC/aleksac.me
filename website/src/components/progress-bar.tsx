import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const html = document.querySelector("html") as HTMLElement;
    const percentageUpdater = () => {
      setPercentage(
        (100 * html.scrollTop) / (html.scrollHeight - html.clientHeight),
      );
    };

    window.addEventListener("scroll", percentageUpdater, { passive: true });

    return () => window.removeEventListener("scroll", percentageUpdater);
  }, []);

  return (
    <div
      style={{
        width: `${percentage}%`,
      }}
      className="fixed top-0 left-0 z-10 h-1 rounded-r-sm bg-black dark:bg-whiteish"
    />
  );
}
