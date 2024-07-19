import styles from "./CardsContainer.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { userType } from "../../types/userType";
import { repositoryType } from "../../types/repositoryType";
import UserCard from "../UserCard/UserCard";
import RepositoryCard from "../RepositoryCard/RepositoryCard";
import LoadingSpinner from "../LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchMore } from "../../store/reducers/githubReducer";
import SearchContainer from "../SearchContainer/SearchContainer";

type Props = {
  searchTerm: string;
  searchType: string;
  handleSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function CardsContainer({
  searchTerm,
  searchType,
  handleSearchTermChange,
  handleSearchTypeChange,
}: Props) {
  const result = useSelector((state: RootState) => state.github.result);
  const isLoading = useSelector((state: RootState) => state.github.isLoading);
  const hasMore = useSelector((state: RootState) => state.github.hasMore);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.container}>
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
      {result.length === 0 && isLoading ? (
        <LoadingSpinner />
      ) : result.length ? (
        <InfiniteScroll
          className="!overflow-hidden mt-10 grid gap-4 grid-cols-2 md:grid-cols-3 place-items-center"
          dataLength={result.length}
          loader={
            <div className="col-span-2 md:col-span-3">
              <LoadingSpinner />
            </div>
          }
          next={() => {
            dispatch(fetchMore({ term: searchTerm, type: searchType }));
          }}
          hasMore={hasMore}
          endMessage={
            <div className="col-span-2 md:col-span-3">
              <div>End of {searchType}</div>
            </div>
          }
        >
          {searchType === "users"
            ? result.map((user, index) => (
                <UserCard key={index} user={user as userType} />
              ))
            : result.map((repository, index) => (
                <RepositoryCard
                  key={index}
                  repository={repository as repositoryType}
                />
              ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-10 flex items-center justify-center">No Data</div>
      )}
    </div>
  );
}

export default CardsContainer;
