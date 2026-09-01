/* eslint-disable @next/next/no-img-element */
"use client";

import { userService } from "@/services/userServices";
import { oauthServices } from "@/services/oauthService";
import { useState } from "react";
import { useRouter } from "next/navigation";

//verify email fron frontend
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function RegisterPage() {
  const [passwordError, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [registration, setRegistration] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    setRegistration(true);
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get("username").trim();
      const email = formData.get("email").trim();
      const password = formData.get("password").trim();
      const password_confirmation = formData.get("passwordConfirmation").trim();

      if (password != password_confirmation) {
        setError("password and password confirmation do not match");
        setRegistration(false);
      }

      if (username.length < 5) {
        setUsernameError("username must be at least of 5 characters");
        setRegistration(false);
      }
      if (!isValidEmail(email) && email !== "") {
        setEmailError("Please enter a valid email address.");
        setRegistration(false);
      } else {
        setEmailError("");
      }

      const response = await userService.register(
        email,
        username,
        password,
        password_confirmation
      );
      console.log(response);
      if (response.success) {
        alert(
          "Compte create with success. Check your email to verify your account"
        );
        router.push("/login");
      } else {
        setRegistration(false);
        setError(response.error);
      }
    } catch (error) {
      setError("Error occured");
      setRegistration(false);
    }
  }

  /***************************OAUTh2 service******************/
  async function handleOAuthLogin(provider) {
    setRegistration(true);
    const res = await oauthServices.loginWithOAuth(provider);
    if (res.success) router.push("/");
    else {
      setError(res.error);
      setRegistration(false);
    }
  }

  /*********************************************************** */

  return (
    <div className="bg-white dark:bg-gray-800 flex justify-center items-center w-full h-screen p-5 py-100">
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-tr from-stone-800 to-red-600 justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 px-10 text-center">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <div
                data-source-location="Layout:58:14"
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
                  data-source-location="Layout:59:16"
                  data-dynamic-content="false"
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
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">CineVerse</h1>
            <p className="text-white/80 text-lg mb-8">
              Browse latest movies on trend and share your reviews with 2M+
              users around the world.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>
          </div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-white/30 rounded-full"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Sign up Page
              </h2>
              <p className="text-gray-600 mb-8">
                Please enter your informations{" "}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  username
                </label>
                <input
                  type="username"
                  id="username"
                  name="username"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-gray-500"
                  placeholder="John Doe"
                  required
                />
                {usernameError && (
                  <p className="text-sm text-red-500">{usernameError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-gray-500"
                  placeholder="johndoe@gmail.com"
                  required
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-gray-500"
                  placeholder="at least 8 characters, an upper, a lower, a number and a special character."
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>
                <input
                  type="Password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-gray-500"
                  placeholder="must match the password above"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {registration ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or sign up with{" "}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuthLogin("github")}
                  type="button"
                  className="w-full cursor-pointer inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    alt="Google"
                    className="w-5 md:mr-2"
                  />
                  <span className="ml-2">GitHub</span>
                </button>
                <button
                  onClick={() => handleOAuthLogin("google")}
                  type="button"
                  className="w-full cursor-pointer inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 md:mr-2"
                  />
                  <span className="ml-2">Google</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account ?
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {" "}
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
