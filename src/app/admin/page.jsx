'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminUtils from "@/components/admin/adminUtils";


export default function Admin() {
  const router = useRouter();

  return (
   
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-4">
          Manage and analyze your platform.
        </p>
      </div>
      <AdminUtils />
    </div>
  );
}
