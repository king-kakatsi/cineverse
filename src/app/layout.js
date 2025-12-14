"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { MovieProvider } from "@/context/MovieContext";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CineVerse - Discover & Track Your Favorite Movies</title>
        <meta name="title" content="CineVerse - Discover & Track Your Favorite Movies" />
        <meta name="description" content="Explore thousands of movies, create your watchlist, and discover your next favorite film. Browse by genre, year, and rating." />
        <meta name="author" content="KINGDOM team" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <MovieProvider>
            <Nav />
            <div className="pt-16">{children}</div>
            <Footer />
          </MovieProvider>
        </UserProvider>
      </body>
    </html>
  );
}