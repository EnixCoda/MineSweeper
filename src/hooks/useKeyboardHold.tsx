import * as React from "react";

export function useKeyboardEvents(
  key: string,
  onKeyPress?: (e: KeyboardEvent) => void,
  onKeyUp?: (e: KeyboardEvent) => void
) {
  React.useEffect(() => {
    const handleKeyPress =
      onKeyPress &&
      ((e: KeyboardEvent): void => {
        if (e.key === key) onKeyPress(e);
      });
    const handleKeyUp =
      onKeyUp &&
      ((e: KeyboardEvent): void => {
        if (e.key === key) onKeyUp(e);
      });
    if (handleKeyPress) document.addEventListener("keypress", handleKeyPress);
    if (handleKeyUp) document.addEventListener("keyup", handleKeyUp);
    return () => {
      if (handleKeyPress)
        document.removeEventListener("keypress", handleKeyPress);
      if (handleKeyUp) document.removeEventListener("keyup", handleKeyUp);
    };
  }, [onKeyPress, onKeyUp]);
}
