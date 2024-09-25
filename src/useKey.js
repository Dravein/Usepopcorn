import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      // Ki kell szedni külön funkcióba hogy ugyanazt hívja meg az addEventListener és a removeEventListener is.
      function callback(e) {
        // key a billentyű leütés amit vizsgálni akarunk
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
          // console.log("CLOSING");
        }
      }

      document.addEventListener("keydown", callback);

      //Cleanupolja az Eventlistenereket.
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
