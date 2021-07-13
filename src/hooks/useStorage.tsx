import * as React from "react";
import { JSONLocalStorage } from "../models/SerializableLocalStorage";

export function useStorage<T>(
  storageKey: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = React.useState<T>(
    JSONLocalStorage.get(storageKey) || defaultValue
  );
  React.useEffect(() => {
    if (JSONLocalStorage.get(storageKey) === null) {
      JSONLocalStorage.set(storageKey, defaultValue);
    }
  }, []);
  const updateValue = React.useCallback(
    (newValue: T) => {
      JSONLocalStorage.set(storageKey, newValue);
      setValue(newValue);
    },
    [storageKey]
  );
  return [value, updateValue];
}
