import { useState, useEffect } from "react";

const KEY = "be6f04d7";

//Custom Hook Movie Fetchelésre.
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Így kell kis alkalmazásokban Fetchelni adatot.
  useEffect(
    function () {
      // //Funkciót adhatunk át neki amit csak akkor hív meg ha létezik (Pl itt a handleCloseMovie amit bezárja a Deatilst ha újra keressünk.)
      //   callback?.();

      // Browser API Race Condition problémára megoldás
      // Fetch-be bekell kapcsolni, és useEffect cleanup fn meghívni
      const controller = new AbortController();
      async function fetchMovies() {
        // Amíg nem tölti be a Fetch-elt Movie adatokat a Loading felirat jelenik meg
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query})`,
            // AbortController bekapcsolása fetchbe
            { signal: controller.signal }
          );

          // Ha megszakad a net Töltés közbe írja ki
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          // Ha nem talál olyan Movie-t amit beírunk
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          ////Batch végzés asszinkron működés miatt nem fog lefutni rögtön.
          // console.log(movies);
          setError("");
        } catch (err) {
          // Ne vegye Errornak az abortot, a cleanup funkciónál
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //Bezárja a Movie Detailt ha elkezdek keresni.
      fetchMovies();
      //Cleanup funkcióba aborcontroller megívása
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  // Azokkal kell visszatérnünk amit majd a JSX-be felhasznulnk
  return { movies, isLoading, error };
}
