"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getFullDate } from "@/helpers/dateHelper";
import { useRouter } from "next/navigation";
import {
  RatingEmoji,
  CustomCard,
  CustomButton,
  User,
  Mail,
  Save,
  MessageSquare,
  Film,
  Calendar,
  AllReviewsContainer,
} from "@/components/ui/button/customComponent";
import PasswordModal from "@/components/ui/modals/passwordModal";
import { fetchFromLocalStorage } from "@/services/localStorageService";
import { userService } from "@/services/userServices";

const toast = { success: (msg) => console.log("TOAST:", msg) };

export default function Profile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userIsActif, setUserIsActif] = useState("");
  const [changeInfosError, setChangeInfosError] = useState(false);
  const [changeInfos, setChangeInfos] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordChange, setPasswordChange] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState();
  const [userReviews, setUserReviews] = useState([]);
  const [userId, setUserId] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const userFromLocalStorage = fetchFromLocalStorage("user");
        if (!userFromLocalStorage) {
          router.push("/login");
          return;
        }
        setUserId(userFromLocalStorage.id);
        const response = await userService.getUser(userFromLocalStorage.id);
        const result = await response.json();
        if (!result.success) {
          router.push("/login");
          return;
        }
        setUser(result.user);
        setUserReviews(result.userReviews);
        setFullName(result.user?.username);
        setUserEmail(result.user?.email);
        setUserRole(result.user?.role);
        setUserIsActif(result.user?.is_actif);
      }
    };

    fetchUser();
  }, []);

  console.log(userReviews);
  const updateProfileInformations = async () => {
    setChangeInfos(true);
    if (fullName.trim().length == 0 || userEmail.trim().length == 0) {
      setChangeInfosError(true);
      setChangeInfos(false);
    } else {
      const response = await userService.updateUser(
        userEmail.trim(),
        fullName.trim(),
        userRole,
        userIsActif,
        userId
      );
      const updatedUser = { ...user, username: fullName, email: userEmail };
      setUser(updatedUser);
      const result = await response.json();
      if (result.success) {
        setChangeInfos(false);
        toast.success("Profile updated successfully");
      }
    }
  };

  //stats
  const [userFavorites, setUserFavorites] = useState([]);
  const stats = useMemo(() => {
    if (!user) return { totalReviews: 0, avgRating: 0, totalFavorites: 0 };

    setUserReviews(user.history);
    setUserFavorites(user?.wishList);

    return {
      totalReviews: userReviews?.length,
      reviews: userReviews,
      avgRating:
        userReviews?.length > 0
          ? (
              userReviews.reduce((sum, r) => sum + r.rating, 0) /
              userReviews?.length
            ).toFixed(1)
          : 0,
      totalFavorites: userFavorites.length,
    };
  }, [user]);
  // password change logic
  const [isPasswordModalOpen, setisPasswordModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    item: null,
    label: "",
    action: "",
  });
  //fonction to active modal to get old password
  const handleOpenPasswordModal = (item, actionType, labelText) => {
    setModalProps({ item: item, action: actionType, label: labelText });
    setisPasswordModalOpen(true);
  };
  //fonction to close old password modal
  const handleClosePasswordModal = () => {
    setisPasswordModalOpen(false);
    setModalProps({ item: null, label: "", action: "" });
  };

  //function to get old password from modal
  const handleOldPassword = (val) => {
    setOldPassword(val);
    setisPasswordModalOpen(false);
    proceedWithPasswordChange(val);
  };

  //logic to call service to change password
  const proceedWithPasswordChange = async (val) => {
    if (password !== passwordConfirmation) {
      setPasswordChange(false);
      toast.error("Passwords do not match");
      return;
    }

    const response = await userService.updatePassword(
      val,
      password,
      passwordConfirmation,
      user?.id
    );

    if (response[1].success) {
      setPasswordChange(false);
      setPassword("");
      setPasswordConfirmation("");
      alert("Password updated");
    }
  };

  //function to change password
  const updatePassword = async () => {
    setPasswordChange(true);
    if (!password || !passwordConfirmation) {
      setPasswordChange(false);
      setPasswordError(true);
      return;
    }
    if (user?.provider === "LOCAL") {
      handleOpenPasswordModal(
        "oldPassword",
        "verify",
        "Confirm password modification"
      );
    } else {
      proceedWithPasswordChange(oldPassword);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header and Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-linear-to-br from-[#e50914] to-[#b20710]">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {user?.username}
              </h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg shadow-lg bg-linear-to-br from-[#e50914]/20 to-gray-900/50 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Reviews Written</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.totalReviews}
                  </p>
                </div>
                <MessageSquare className="w-10 h-10 text-[#e50914] opacity-50" />
              </div>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-linear-to-br from-blue-500/20 to-gray-900/50 border border-gray-800">
              <a href="/user/favorites" className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Favorite Films</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {userFavorites.length}
                    </p>
                  </div>

                  <Film className="w-10 h-10 text-blue-500 opacity-50" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
            {["info", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-sm cursor-pointer font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-[#e50914] text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {tab === "info" && "Profile Info"}
                {tab === "reviews" && `My Reviews (${stats.totalReviews})`}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <CustomCard title="Profile Information">
                <div className="grid sm:grid-cols-2 gap-4 grid-cols-1">
                  <CustomCard title="Email & Username">
                    <div className="space-y-4 w-auto">
                      {changeInfosError && (
                        <div className="text-red-500 text-sm">
                          Fullname and email are required
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="text-gray-400 block mb-2"
                        >
                          Username
                        </label>
                        <input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-3 rounded-md bg-black/50 border border-gray-700 text-white focus:ring-[#e50914] focus:border-[#e50914]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="text-gray-400 block mb-2"
                        >
                          Email
                        </label>
                        <input
                          name="userEmail"
                          type="text"
                          id="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full p-3 rounded-md bg-black/50 border border-gray-700 text-white focus:ring-[#e50914] focus:border-[#e50914]"
                        />
                      </div>
                      <CustomButton
                        onClick={updateProfileInformations}
                        className="bg-[#e50914] hover:bg-[#b20710] text-white cursor-pointer"
                      >
                        <Save className="w-4 h-4 mr-2 " />
                        {changeInfos ? "Saving Changes..." : "Save Changes"}
                      </CustomButton>
                    </div>
                  </CustomCard>
                  <CustomCard title=" Modify Your Password">
                    <div className="space-y-4 w-auto">
                      {passwordError && (
                        <div className="text-red-500 ext-sm">
                          Fields are requireds
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="password"
                          className="text-gray-400 block mb-2"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-3 rounded-md bg-black/50 border border-gray-700 text-white focus:ring-[#e50914] focus:border-[#e50914]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="passwordConfirmation"
                          className="text-gray-400 block mb-2"
                        >
                          Password Confirmation
                        </label>
                        <input
                          type="password"
                          id="passwordConfirmation"
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                          className="w-full p-3 rounded-md bg-black/50 border border-gray-700 text-white focus:ring-[#e50914] focus:border-[#e50914]"
                        />
                      </div>
                      <CustomButton
                        onClick={updatePassword}
                        className="bg-[#e50914] hover:bg-[#b20710] text-white cursor-pointer"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {passwordChange ? "Changing" : "Save Changes"}
                      </CustomButton>
                    </div>
                  </CustomCard>
                </div>
              </CustomCard>
              <CustomCard title="Other Informations">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-2">Role</p>
                    <div className="flex items-center gap-2 p-3 bg-black/50 border border-gray-700 rounded-md">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-white capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Member Since</p>
                    <div className="flex items-center gap-2 p-3 bg-black/50 border border-gray-700 rounded-md">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-white">
                        {getFullDate(user?.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CustomCard>
            </div>
          )}

          {activeTab === "reviews" && (
            <AllReviewsContainer user={user} userReviews={stats.reviews} />
          )}
        </div>
      </div>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onConfirm={handleOldPassword}
        input=""
        label="Confirm password modification"
        action={modalProps.action}
      />
    </div>
  );
}
