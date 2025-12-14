// export default function navbar() {
//   return (
//     // <header>
//     // <div className=" fixed flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//     //   <div data-source-location="Layout:55:10" data-dynamic-content="true" class="flex items-center justify-between h-16"><a data-source-location="Layout:57:12" data-dynamic-content="false" class="flex items-center gap-2 group" href="/films"><div data-source-location="Layout:58:14" data-dynamic-content="false" class="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film w-6 h-6" data-source-location="Layout:59:16" data-dynamic-content="false"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 3v18"></path><path d="M3 7.5h4"></path><path d="M3 12h18"></path><path d="M3 16.5h4"></path><path d="M17 3v18"></path><path d="M17 7.5h4"></path><path d="M17 16.5h4"></path></svg></div><span data-source-location="Layout:61:14" data-dynamic-content="false" class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">CineVerse</span></a><nav data-source-location="Layout:67:12" data-dynamic-content="true" class="hidden md:flex items-center gap-6"><a data-source-location="Layout:68:14" data-dynamic-content="false" class="text-sm font-medium transition-colors hover:text-[#e50914] text-gray-300" href="/films">Browse Movies</a><a data-source-location="Layout:78:18" data-dynamic-content="false" class="text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300" href="/favorites"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-4 h-4" data-source-location="Layout:84:20" data-dynamic-content="false"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>Favorites</a><a data-source-location="Layout:87:18" data-dynamic-content="false" class="text-sm font-medium transition-colors hover:text-[#e50914] flex items-center gap-1 text-gray-300" href="/profile"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-4 h-4" data-source-location="Layout:93:20" data-dynamic-content="false"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>Profile</a><a data-source-location="Layout:97:20" data-dynamic-content="false" class="text-sm font-medium transition-colors hover:text-[#ffd700] flex items-center gap-1 text-gray-300" href="/admindashboard"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard w-4 h-4" data-source-location="Layout:103:22" data-dynamic-content="false"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>Admin</a></nav><div data-source-location="Layout:112:12" data-dynamic-content="true" class="hidden md:flex items-center gap-3"><span data-source-location="Layout:115:18" data-dynamic-content="true" class="text-sm text-gray-400">Jocelyne Tossi</span><button data-source-location="Layout:116:18" data-dynamic-content="false" class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-8 rounded-md px-3 text-xs text-gray-300 hover:text-white hover:bg-white/10"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out w-4 h-4 mr-2" data-source-location="Layout:122:20" data-dynamic-content="false"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Logout</button></div><button data-source-location="Layout:137:12" data-dynamic-content="true" class="md:hidden p-2 text-gray-300 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-6 h-6" data-source-location="Layout:141:56" data-dynamic-content="false"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button></div>
//     // </div>
//     // </header>
//   );
// }
"use client";

import { useState } from "react";
// import { Link } from "react-router-dom";
// import { logout } from "../../services/auth";

export default function HeaderComponent() {
//   let user = localStorage.getItem("access_token") && localStorage.getItem("access_token") ? localStorage.getItem("user") : null

//   user = JSON.parse(user)


//   const [showProfil, setShowProfil] = useState(false)

//   const toShowProfil = () => {
//     setShowProfil(!showProfil)
//   }

//   const toLogOut = () => {
//     logout()
//     window.location.href = "/"
//   }

  return (
    <>
      <header className="bg-white shadow-xs  w-full h-20 text-white z-50 sticky top-0 ">
        <div className="flex justify-between items-center px-[5%] h-full">
          <div>
            <a href="">
              <image className="w-14 h-14 mr-2 rounded-[30%]" src="https://t4.ftcdn.net/jpg/05/97/47/95/360_F_597479556_7bbQ7t4Z8k3xbAloHFHVdZIizWK1PdOo.jpg" alt="logo" />
            </a>
          </div>

          {/* {user ? ( */}
            <div className="relative">
              {/* <img onClick={toShowProfil} id="avatarButton" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" className="w-15 h-15 rounded-full cursor-pointer" src="/assets/img/profil/user.png" alt="User dropdown" />
              {showProfil ? ( */}
                <div id="userDropdown" className="absolute right-0 top-[120%] z-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>Name, lastname</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                  <li>
                    {/* <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">CineVerse</Link> */}
                  </li>
                  {/* <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                  </li> */}
                </ul>
                <div className="py-1">
                  <button className="block text-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                </div>
              </div>
              {/* ) : (
                ''
              )} */}
            </div>

          {/* ) : ( */}
            <div className="lg:flex gap-4 lg:items-center ">
                {/* <Link to="/login"  className="px-8 py-2 rounded-lg border-2 border-[#7236e6] text-[#3361e2] font-semibold cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline">
              Sign In
              </Link>
              <Link to="/register"  className="px-8 py-2 rounded-lg bg-linear-to-r from-[#3361e2] via-[#5246f7] to-[#7236e6] font-semibold cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline">
              Sign Up</Link> */}
            

            </div>
          {/* )} */}

        </div>
      </header>
    </>
  )
}
