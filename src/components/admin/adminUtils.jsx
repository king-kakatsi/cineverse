"use client";
import React, { useState, useEffect } from "react";
import { Film, Users, BarChart3 } from "lucide-react"; 
import Link from 'next/link'; 
export default function AdminUtils() {
  return (
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Manage Films Link */}
          <Link href={"/admin/movies"}>
            <div className="rounded-lg shadow-xl p-6 bg-gray-900/50 border border-gray-800 hover:border-[#e50914] transition-colors cursor-pointer h-full">
              <div className="pt-0">
                <Film className="w-12 h-12 text-[#e50914] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Manage Films</h3>
                <p className="text-gray-400 text-sm">Add, edit, or delete films from your catalog</p>
              </div>
            </div>
          </Link>

          {/* Manage Users Link */}
          <Link href={"/admin/manage_users"}>
            <div className="rounded-lg shadow-xl p-6 bg-gray-900/50 border border-gray-800 hover:border-blue-500 transition-colors cursor-pointer h-full">
              <div className="pt-0">
                <Users className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Manage Users</h3>
                <p className="text-gray-400 text-sm">View and manage user accounts and roles</p>
              </div>
            </div>
          </Link>

          {/* Statistics Link */}
          <Link href={"/admin/statistics"}>
            <div className="rounded-lg shadow-xl p-6 bg-gray-900/50 border border-gray-800 hover:border-[#ffd700] transition-colors cursor-pointer h-full">
              <div className="pt-0">
                <BarChart3 className="w-12 h-12 text-[#ffd700] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Statistics</h3>
                <p className="text-gray-400 text-sm">View detailed platform analytics</p>
              </div>
            </div>
          </Link>
        </div>
  );
}

