// import {  useLocation, useNavigate } from "react-router-dom";
"use client"
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constant";
import Loader from "./Loader";
import { INavLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useSignOutAccount } from "@/lib/react-query/queries";
// import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const LeftSidebar = () => {
    const pathname = usePathname();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

//   const { mutate: signOut } = useSignOutAccount();

//   const handleSignOut = async (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     e.preventDefault();
//     signOut();
//     setIsAuthenticated(false);
//     setUser(INITIAL_USER);
//     navigate("/sign-in");
//   };

  return (
    <nav className="leftsidebar fixed top-0 left-0 h-100">
      <div className="flex flex-col gap-11">
        <Link href="/" className="flex gap-3 items-center justify-center">
          <img
            src="/images/1aaa.png"
            alt="logo"
            width={80}
            height={24}
          />
        </Link>

        {/* {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : ( */}
          {/* <Link href={`/profile/${user.id}`} className="flex gap-3 items-center"> */}
          <Link href={`/profile`} className="flex gap-3 items-center">
            <img
            //   src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              src={ "/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              {/* <p className="body-bold">{user.name}</p> */}
              <p className="body-bold">Reymond</p>
              {/* <p className="small-regular text-light-3">@{user.username}</p> */}
              <p className="small-regular text-light-3">@e2e2a</p>
            </div>
          </Link>
        {/* )} */}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <Link
                  href={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        // onClick={(e) => handleSignOut(e)}>
        onClick={() => {}}>
        <img src="/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;