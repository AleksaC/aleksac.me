import { MutableRefObject, useEffect } from "react";

const copyIcon = `\
  <svg
    width="16"
    height="16"
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.8421 11.8182H3.47368V3.54545H9.8421V11.8182ZM9.8421 2.36364H3.47368C3.16659 2.36364 2.87208 2.48815 2.65493 2.70978C2.43778 2.93142 2.31579 3.23202 2.31579 3.54545V11.8182C2.31579 12.1316 2.43778 12.4322 2.65493 12.6539C2.87208 12.8755 3.16659 13 3.47368 13H9.8421C10.1492 13 10.4437 12.8755 10.6609 12.6539C10.878 12.4322 11 12.1316 11 11.8182V3.54545C11 3.23202 10.878 2.93142 10.6609 2.70978C10.4437 2.48815 10.1492 2.36364 9.8421 2.36364ZM8.10526 0H1.15789C0.850802 0 0.556287 0.124513 0.339139 0.346147C0.121992 0.56778 0 0.86838 0 1.18182V9.45455H1.15789V1.18182H8.10526V0Z"
      fill="currentColor"
    />
  </svg>
`;

const copyButton = `\
  <div class="w-full h-0 z-10 relative">
    <button
      class="absolute w-6 h-6 flex p-1 rounded-sm bg-opacity-90 bg-white text-black items-center justify-center top-2 right-3"
      aria-label="copy code"
    >
      ${copyIcon}
    </button>
  </div>
`;

const copiedTooltip = `\
<div class="absolute flex whitespace-normal h-6 p-0 items-center justify-center leading-none top-2 right-11 text-white text-opacity-90 text-sm font-thin">
  Copied!
</div>
`;

const copyToClipboard = (preElement: HTMLElement) => {
  const toCopy: string[] = [];

  preElement.childNodes.forEach((child, idx) => {
    if (idx !== 0 && child.textContent) {
      toCopy.push(child.textContent);
    }
  });

  navigator.clipboard.writeText(toCopy.join("").trim());
};

const flashTooltip = (copyBtn: HTMLDivElement) => {
  const tmp = document.createElement("template");
  tmp.innerHTML = copiedTooltip.trim();
  const tooltip = tmp.content.firstChild as ChildNode;

  copyBtn.appendChild(tooltip);

  setTimeout(() => {
    copyBtn.removeChild(tooltip);
  }, 500);
};

export const useCodeCopyButtons = (rootRef: MutableRefObject<HTMLElement>) => {
  useEffect(() => {
    const codeBlocks = rootRef.current.querySelectorAll("pre");
    for (const codeBlock of codeBlocks) {
      const tmp = document.createElement("template");
      tmp.innerHTML = copyButton.trim();
      const copyBtn = tmp.content.firstChild as HTMLDivElement;

      copyBtn.addEventListener(
        "click",
        () => {
          copyToClipboard(codeBlock);
          flashTooltip(copyBtn);
        },
        { capture: true },
      );

      codeBlock.insertBefore(copyBtn, codeBlock.firstChild);
    }
  }, [rootRef]);
};
