import { repositoryType } from "../../types/repositoryType";

type Props = {
  repository: repositoryType;
};

function RepositoryCard({ repository }: Props) {
  return (
    <div className="h-full w-full max-w-sm bg-white rounded shadow-md overflow-hidden">
      <img
        loading="lazy"
        className="w-full"
        src={repository.owner?.avatar_url}
        alt="Avatar"
      />
      <div className="px-6 py-4">
        <a
          target="_blank"
          href={repository.html_url}
          rel="noopener noreferrer nofollow"
          className="font-bold text-xl mb-2"
        >
          {repository.full_name}
        </a>
        <p className="text-gray-700 text-sm">
          Description: {repository.description}
        </p>
        <p className="text-gray-700 text-sm">Forks: {repository.forks_count}</p>
        <p className="text-gray-700 text-sm">
          Watchers: {repository.watchers_count}
        </p>
      </div>
    </div>
  );
}

export default RepositoryCard;
