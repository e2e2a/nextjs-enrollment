// import { Models } from "appwrite";
// import { Link } from "react-router-dom";

import Link from "next/link";
import { Button } from "../ui/button";

// type UserCardProps = {
//   user: Models.Document;
// };

// const UserCard = ({ user }: any) => {
const UserCard = () => {
  return (
    <Link href={`/profile`} className="user-card">
      <img
        src={"/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {/* {user.name} */} Reymond
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          {/* @{user.username} */} @e2e2a
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;