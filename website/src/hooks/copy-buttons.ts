import { MutableRefObject, useEffect } from "react";

const copyButton = `\
  <div class="w-full h-0 z-10 relative">
    <button
      class="absolute h-5 w-10 p-1 flex rounded-sm bg-opacity-90 bg-white text-black items-center justify-end top-0 -right-0 text-xs"
      aria-label="copy code"
    >
      Copy
    </button>
  </div>
`;

const copiedTooltip = `\
<div class="absolute flex whitespace-normal h-5 p-0 items-center justify-center leading-none -top-0 right-12 text-white text-opacity-90 text-xs font-thin">
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
