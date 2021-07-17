import * as React from "react";

let lock = false; // there should be no more than 1 instance of this component taking effect

const variableName = "--vh";

function setViewHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty(variableName, `${vh}px`);
}

function unsetViewHeight() {
  document.documentElement.style.removeProperty(variableName);
}

export function VH(props: React.PropsWithChildren<{}>) {
  React.useLayoutEffect(() => {
    if (lock) return;
    lock = true;
    setViewHeight();

    window.addEventListener("resize", setViewHeight);
    return () => {
      lock = false;
      unsetViewHeight();
      window.removeEventListener("resize", setViewHeight);
    };
  }, []);

  return <>{props.children}</>;
}

export const fullHeight = `calc(var(${variableName}, 1vh) * 100)`
