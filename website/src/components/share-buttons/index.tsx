import classNames from "classnames";
import { useState } from "react";

import shareButtonStyles from "./share-buttons.module.css";

import FacebookIcon from "@components/icons/facebook";
import LinkedinIcon from "@components/icons/linkedin";
import TwitterIcon from "@components/icons/twitter";
import CopyIcon from "@components/icons/copy";

function getEncodedHref() {
  return encodeURIComponent(window.location.href);
}

const ShareButtons = () => {
  const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);

  return (
    <div className="relative flex space-x-4">
      <button
        className={shareButtonStyles["share-button"]}
        onClick={() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${getEncodedHref()}`,
          );
        }}
        title="Share on Facebook"
      >
        <FacebookIcon />
      </button>
      <button
        className={shareButtonStyles["share-button"]}
        onClick={() => {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${getEncodedHref()}`,
          );
        }}
        title="Share on LinkedIn"
      >
        <LinkedinIcon />
      </button>
      <button
        className={shareButtonStyles["share-button"]}
        onClick={() => {
          window.open(
            `https://twitter.com/intent/tweet?url=${getEncodedHref()}`,
          );
        }}
        title="Share on Twitter"
      >
        <TwitterIcon />
      </button>
      <button
        className={shareButtonStyles["share-button"]}
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href);
          setCopyTooltipVisible(true);
          setTimeout(() => setCopyTooltipVisible(false), 750);
        }}
        title="Copy URL"
      >
        <CopyIcon />
      </button>
      <div
        className={classNames(
          "absolute -top-8 right-1",
          copyTooltipVisible ? "flex flex-col items-end" : "hidden",
        )}
      >
        <div className="top-0 rounded-sm bg-black px-2 py-1 text-xs text-white">
          URL Copied
        </div>
        <div className="mr-1 h-0 w-0 border-t-[8px] border-l-[6px] border-r-[6px] border-black border-l-transparent border-r-transparent" />
      </div>
    </div>
  );
};

export default ShareButtons;
