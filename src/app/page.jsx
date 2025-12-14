import HeroSection from "@/components/HeroSection";
import MoviesList from "@/components/films/MoviesList";
import MoviesFilter from "@/components/films/MoviesFilter";

export default function Home() {
  return (
    <div className="flex min-w-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-w-screen w-full max-w-7xl flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        
        <HeroSection />

        <MoviesFilter />

        <MoviesList />
        
      </main>
    </div>
  );
}