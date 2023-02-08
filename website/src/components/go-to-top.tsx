import classNames from "classnames";
import { FC, useState, useEffect } from "react";

const GoToTopButton: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;

      if (!visible && scrollTop >= 20) {
        setVisible(true);
      } else if (visible && scrollTop < 20) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => window.removeEventListener("scroll", scrollListener);
  }, [visible]);

  return (
    <button
      className={classNames(
        "fixed bottom-8 right-6 rounded-md border border-black bg-white bg-opacity-80 px-1 py-0.5 dark:border-whiteish dark:bg-blackish dark:bg-opacity-80",
        visible || "hidden",
      )}
      aria-label="go to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
};

export default GoToTopButton;
