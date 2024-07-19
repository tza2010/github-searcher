import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Home.module.css";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { clearResults, fetchData } from "../../store/reducers/githubReducer";
import CardsContainer from "../../components/CardsContainer/CardsContainer";
import SearchContainer from "../../components/SearchContainer/SearchContainer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("users");
  const [dataPreview, setDataPreview] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const getData = useCallback(
    (term: string, type: string) => {
      dispatch(clearResults());
      if (term.length >= 3) {
        dispatch(fetchData({ term, type }));
        setDataPreview(true);
      } else {
        setDataPreview(false);
      }
    },
    [dispatch]
  );

  const debounceFunction = useMemo(() => debounce(getData, 500), [getData]);

  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      debounceFunction(e.target.value, searchType);
    },
    [debounceFunction, searchType]
  );

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
    getData(searchTerm, e.target.value);
  };

  useEffect(() => {
    dispatch(clearResults());
  }, [dispatch]);

  return dataPreview ? (
    <CardsContainer
      searchTerm={searchTerm}
      searchType={searchType}
      handleSearchTermChange={handleSearchTermChange}
      handleSearchTypeChange={handleSearchTypeChange}
    />
  ) : (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className={styles.logo}>
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
        />
        <div>
          <h1 className={styles.title}>GitHub Searcher</h1>
          <p className={styles.description}>
            Search users or repositories below
          </p>
        </div>
      </div>
      <SearchContainer
        searchTerm={searchTerm}
        searchType={searchType}
        handleSearchTermChange={handleSearchTermChange}
        handleSearchTypeChange={handleSearchTypeChange}
      />
    </div>
  );
}

export default Home;
