import { FC } from "react";

const Intro: FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="mx-auto max-w-3xl ">
      <h1 className="pb-4 text-3xl font-bold md:pb-6 md:text-5xl">{title}</h1>
      <div className="mb-8 md:mb-10">{children}</div>
    </div>
  );
};

export default Intro;
