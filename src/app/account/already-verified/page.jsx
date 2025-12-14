"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlreadyVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Account already verified
      </h1>
      <p className="text-gray-600 mb-8">
        Your CinéVerse account is already active. You will be redirected to the
        login page…
      </p>

      <button
        onClick={() => router.push("/login")}
        className="bg-[#FF4F5A] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#e0404b] transition cursor-pointer"
      >
        Go to login now
      </button>
    </div>
  );
}
