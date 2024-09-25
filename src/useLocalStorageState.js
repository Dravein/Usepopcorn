import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // Kell ha nincs semmi a local Storage-ba ne adjon hibát.
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Movie Local Storage tárolás Effect segítségével csak akkor fut ha megváltozott a watched
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
