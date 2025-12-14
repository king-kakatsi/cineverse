"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Film, BarChart3 } from "lucide-react";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Manage Users", path: "/admin/manage_users", icon: <User size={18} /> },
        { name: "Manage Movies", path: "/admin/movies", icon: <Film size={18} /> },
        { name: "Platform Statistics", path: "/admin/statistics", icon: <BarChart3 size={18} /> },
    ];

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${pathname === item.path
                                ? "bg-zinc-200 dark:bg-zinc-700 font-semibold text-[#e50914]"
                                : "text-gray-700 dark:text-gray-200 hover:text-[#e50914] dark:hover:text-[#e50914] dark:hover:bg-zinc-800"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
            {/* Main content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}