import { userType } from "../../types/userType";

type Props = {
  user: userType;
};

function UserCard({ user }: Props) {
  return (
    <div className="h-full w-full max-w-sm bg-white rounded shadow-md overflow-hidden">
      <img
        loading="lazy"
        className="w-full"
        src={user.avatar_url}
        alt="Avatar"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{user.login}</div>
        <p className="text-gray-700 text-sm">Score: {user.score}</p>
      </div>
    </div>
  );
}

export default UserCard;
