"use client";
import { useEffect, useState } from "react";
import { Trash2, Edit, Search, Users } from "lucide-react";
import { adminServices } from "@/services/adminServices";
import { fetchFromLocalStorage } from "@/services/localStorageService";
import { useRouter } from "next/navigation";
import AdminUtils from "@/components/admin/adminUtils";

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const user = fetchFromLocalStorage("user");
    if (!user || user.role != "ADMIN") {
      router.push("/");
    }
    async function getUsers() {
      try {
        const response = await adminServices.getUsers();
        const results = await response.json();
        setUsers(results.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  // Fonction pour changer le rôle avec confirmation
  const handleRoleToggle = async (user) => {
    const newRole = user.role === "ADMIN" ? "user" : "admin";
    const message =
      newRole === "admin"
        ? `Do you really want to give the Admin role to ${user.username} ?`
        : `Do you really want to remove the Admin role from ${user.username} ?`;

    if (window.confirm(message)) {
      const response = await adminServices.updateUserRole(user.id, newRole);
      console.log(response);
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      console.log(`Rôle changé pour ${user.username} : ${newRole}`);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username} ?`)) {
      const response = await adminServices.deleteUser(user.id);
      console.log(response);
      setUsers(users.filter((u) => u.id !== user.id));
      console.log(`Deleted user : ${user.username}`);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  // Fonction pour sauvegarder les modifications
  const handleSaveEdit = async () => {
    const response = await adminServices.updateUser(
      selectedUser.email,
      selectedUser.username,
      selectedUser.role,
      selectedUser.is_actif,
      selectedUser.id
    );
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    setShowEditModal(false);
    console.log("Modified user :", selectedUser);
  };

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-zinc-400 text-sm">
          View and manage user accounts and permissions
        </p>
      </div>
      <div className="mb-4">
        <AdminUtils />
      </div>
      {/* Carte contenant le tableau */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        {/* Header avec compteur et recherche */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-zinc-400" />
            <span className="text-sm font-medium">
              User Accounts ({filteredUsers.length})
            </span>
          </div>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>
        {/* Tableau */}
        {loading ? (
          <div className="p-8 text-center text-zinc-400">Users loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No user found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Role
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Actif
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Joined
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-800 hover:bg-[#e50914]/10 transition-colors"
                  >
                    <td className="p-4 text-sm">{user.username}</td>
                    <td className="p-4 text-sm text-zinc-400">{user.email}</td>
                    <td className="p-4">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.is_actif ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-green-500 border border-green-500/30">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-red-500 border border-red-500/30 ">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Toggle User/Admin */}
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className="text-xs px-3 py-1.5 rounded bg-[#e50914] hover:bg-[#b20710] text-white transition-colors cursor-pointer"
                          title={
                            user.role === "ADMIN"
                              ? "Demote to User"
                              : "Promote to Admin"
                          }
                        >
                          {user.role === "ADMIN" ? "→ User" : "→ Admin"}
                        </button>

                        {/* Bouton Modifier */}
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded hover:bg-zinc-800 transition-colors hover:text-[#e50914] text-zinc-400 cursor-pointer"
                          title="Update"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded hover:bg-zinc-800 transition-colors text-red-400 hover:text-red-300 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de modification */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Update User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-400">
                  User name
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-400">
                  Rule
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:border-zinc-600"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-400">
                  Is Actif
                </label>
                <select
                  value={selectedUser.is_actif}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      is_actif: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:border-zinc-600"
                >
                  <option value="true">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-[#e50914] hover:bg-[#b20710] text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
