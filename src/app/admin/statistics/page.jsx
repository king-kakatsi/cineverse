"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
import { Film, Users, Star, TrendingUp, } from "lucide-react"; 

import movieService from "@/services/movieService";
import { userService } from "@/services/userServices";  
import AdminUtils from "@/components/admin/adminUtils";
import { GenreDistributionChart } from "@/components/admin/graphics/genreDistributionChart";
import { StatCard } from "@/components/admin/graphics/startCard";
import { UserRegistrationTrendChart } from "@/components/admin/graphics/userRegistrationChart";
import { TopMoviesBarChart } from "@/components/admin/graphics/topMovies";


const EMPTY_CORE_STATS = {
    totalFilms: 0,
    totalUsers: 0,
    totalReviews: 0, 
    totalLocalReviews: 0,
    adminUsers: 0,
    avgRating: 0,
    localAvgRating: 0,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // State for all fetched data points
  const [stats, setStats] = useState(EMPTY_CORE_STATS);
  const [genreData, setGenreData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  // const [reviewSentiment, setReviewSentiment] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllStats() {
      setIsLoading(true);
      try {
        const [
          coreStats, 
          genreDist, 
          topRated, 
          userRegTrend, 
          reviewSent
        ] = await Promise.all([
          movieService.getAdminDashboardStats(),
          movieService.getGenreDistributionStats(),
          movieService.getTopRatedMovies(10), 
          movieService.getUserRegistrationTrend(90), 
        ]);
        // console.log('=========================================')
        // console.log(coreStats, 
        //   genreDist, 
        //   topRated, 
        //   userRegTrend, 
        //   reviewSent)
        // console.log('=========================================')

        if (isMounted) {
          setStats(coreStats);
          setGenreData(genreDist);
          setTopMovies(topRated);
          setUserGrowth(userRegTrend);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        if (isMounted) {
            setStats(EMPTY_CORE_STATS);
            setGenreData([]);
            setTopMovies([]);
            setUserGrowth([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    const checkAuth = (currentUser) => {
        if (!currentUser) {
            router.push('/login'); 
            return;
        }
        
        // Ensure user is an ADMIN before fetching data
        if (currentUser.role !== 'ADMIN') {
            router.push('/films'); 
            return;
        }
        
        setUser(currentUser);
        fetchAllStats();
    };

    const subscription = userService.user.subscribe(user => {
        if (user !== undefined) {
            checkAuth(user);
        }
    });

    return () => {
        isMounted = false;
        subscription.unsubscribe();
    };
    
  }, [router]);
  
  const { totalFilms, totalUsers, totalReviews, totalLocalReviews, adminUsers, avgRating,  localAvgRating } = stats;

  if (user === null || isLoading) {
      return (
          <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
              <p className="text-white text-xl">Loading Admin Data...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 mt-4">
          <AdminUtils 
          />
        </div>
        <span className=" flex gap-3 font-semibold mb-4 "><h2 className="text-3xl font-bold text-white mb-6ext-2xl">Cineverse Main KPIs</h2></span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Films" 
            value={totalFilms} 
            icon={Film} 
            colorClass="[#e50914]" 
          />
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            subtext={`${adminUsers} admins`}
            icon={Users} 
            colorClass="blue-500" 
          />
          <StatCard 
            title="Avg Rating" 
            value={avgRating.toFixed(1)} 
            subtext={`${totalReviews} reviews`}
            icon={Star} 
            colorClass="[#ffd700]" 
          />
          {/* <StatCard 
            title="Local Avg Rating" 
            value={localAvgRating.toFixed(1)} 
            subtext={`${totalLocalReviews} reviews`}
            icon={Star} 
            colorClass="[#ffd700]" 
          /> */}
          <StatCard 
            title="Total Reviews" 
            value={totalReviews} 
            icon={TrendingUp} 
            colorClass="green-500" 
          />
        </div>
{/* graphic */}
        <h2 className="text-3xl font-bold text-white mb-6">Platform Analytics</h2>
        <div className="grid grid-cols- lg:grid-cols-2 gap-6 mb-12">
            <TopMoviesBarChart  data={topMovies} />
            <GenreDistributionChart data={genreData} />
           <UserRegistrationTrendChart data={userGrowth} />
        </div>
      </div>
    </div>
  );
}