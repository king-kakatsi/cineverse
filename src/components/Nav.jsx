"use client";

import { getFromApi, postWithApi } from "@/services/axiosService";
import { fetchFromLocalStorage, saveInLocalStorage } from "@/services/localStorageService";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const [user, setUser] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saveUser = () =>{
        setUser(fetchFromLocalStorage("user"));
      }
      saveUser();
    }
  }, []);

  async function handleLogout() {
    if (typeof window !== "undefined") {
      setUser("");
      saveInLocalStorage("user", "");
      saveInLocalStorage("token", "");
      await getFromApi('auth/logout')
    }
    location.reload();
  }

  return (
    <header>
      <div className="bg-black fixed top-0 left-0 right-0 z-50 flex items-center justify-center font-sans dark:bg-black">
        <div
          data-dynamic-content="true"
          className="flex items-center justify-between h-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          {/* Logo Link */}
          <Link
            data-dynamic-content="false"
            className="flex items-center gap-2 group mr-8 z-20"
            href="/"
            onClick={closeMenu}
          >
            {/* logo */}
            <div
              data-dynamic-content="false"
              className="w-10 h-10 bg-linear-to-br from-[#e50914] to-[#b20710] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-film w-6 h-6"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M7 3v18"></path>
                <path d="M3 7.5h4"></path>
                <path d="M3 12h18"></path>
                <path d="M3 16.5h4"></path>
                <path d="M17 3v18"></path>
                <path d="M17 7.5h4"></path>
                <path d="M17 16.5h4"></path>
              </svg>
            </div>
            <span
              data-dynamic-content="false"
              className="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              CineVerse
            </span>
          </Link>

          {/* Menu Button for Mobile */}
          <button
            data-dynamic-content="true"
            className="md:hidden p-2 text-gray-300 hover:text-white z-20"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer lucide lucide-x w-6 h-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer lucide lucide-menu w-6 h-6"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </button>

          <div
            className={`
                  fixed inset-0 top-16 bg-black/95 backdrop-blur-sm z-10 p-6 
                  flex-col items-start space-y-4 transition-transform duration-300 ease-in-out
                  ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
                  md:static md:flex md:flex-row md:space-y-0 md:p-0 md:bg-transparent md:backdrop-blur-none md:translate-x-0 md:items-center md:gap-6
                `}
          >
            {/* Navigation links */}
            {user && (
              <div className="flex">
                <nav
                  data-dynamic-content="true"
                  className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full"
                >
                  <Link
                    data-dynamic-content="false"
                    className="text-lg md:text-sm font-medium transition-colors hover:text-[#e50914] text-gray-300"
                    href="/"
                    onClick={closeMenu}
                  >
                    Browse Movies
                  </Link>
                  {/********************************************************************************************* */}

                  <a
                    data-dynamic-content="false"
                    className="text-lg md:text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300"
                    href="/user/favorites"
                    onClick={closeMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart w-4 h-4"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    Favorites
                  </a>
                  <a
                    data-dynamic-content="false"
                    className="text-lg md:text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300"
                    href="/profile"
                    onClick={closeMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user w-4 h-4"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {user.username}
                  </a>
                  {user.role == "ADMIN" && (
                    <a
                      data-dynamic-content="false"
                      className="text-lg md:text-sm font-medium transition-colors hover:text-[#ffd700] flex items-center gap-1 text-gray-300"
                      href="/admin"
                      onClick={closeMenu}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-layout-dashboard w-4 h-4"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                      </svg>
                      Admin
                    </a>
                  )}
                </nav>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-4 md:mt-0 pt-4 pb-4 border-t border-gray-800 md:border-t-0 w-full md:w-auto">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-start md:justify-center gap-1 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-8 rounded-md px-5 text-xs text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-log-out w-4 h-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" x2="9" y1="12" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
            {/********************************************************************************************** */}
            {!user && (
              <a
                data-dynamic-content="false"
                className="text-lg md:text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300"
                href="/register"
                onClick={closeMenu}
              >
                Register
              </a>
            )}
            {!user && (
                <a
                  data-dynamic-content="false"
                  className="text-lg md:text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300"
                  href="/login"
                  onClick={closeMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user w-4 h-4"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Login
                </a>
              
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
