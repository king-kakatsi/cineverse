import { NextResponse } from "next/server";
import { getFromApi, postWithApi } from "./axiosService";
import { saveInLocalStorage } from "./localStorageService";
import { fetchFromLocalStorage } from "./localStorageService";
import { BehaviorSubject } from "rxjs";
import { updateWithApi } from "./axiosService";

const userSubject = new BehaviorSubject(
  process.browser && fetchFromLocalStorage("user")
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  register,
  resetPassword,
  forgotPassword,
  getUser,
  updateUser,
  updatePassword,
};

async function login(email, password) {
  const response = await postWithApi("auth/login", { email, password });
  if (response[0]) {
    const user_infos = await response[1].data;
    saveInLocalStorage("user", user_infos.user);
    saveInLocalStorage("token", user_infos.access_token);
    return {
      success: true,
      user: user_infos,
    };
  } else {
    const message = await response[1].message;
    return {
      success: false,
      error: message,
    };
  }
}

async function register(email, username, password, password_confirmation) {
  const response = await postWithApi("auth/register", {
    email,
    username,
    password,
    password_confirmation,
  });
  if (response[1].success) {
    return {
      success: true,
    };
  }
  const message = response[1].message;
  return {
    error: message,
    success: false,
  };
}

async function resetPassword(email) {
  const response = await postWithApi("auth/reset", email);
  if (response[1].success) {
    return {
      success: true,
    };
  }
  const message = response[1].message;
  return {
    error: message,
    success: false,
  };
}

async function forgotPassword(access_token, password, password_confirmation) {
  const response = await postWithApi("/auth/password", {
    access_token,
    password,
    password_confirmation,
  });

  if (response[1].success) {
    return {
      success: true,
    };
  }
  const message = response[1].message;
  return {
    error: message,
    success: false,
  };
}

async function getUser(id) {
  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User is required",
        },
        {
          status: 400,
        }
      );
    }
    const response = await getFromApi(`users/${id}`, {});
    return NextResponse.json(
      {
        success: true,
        user: response[1].user,
        userReviews: response[1].userReviews,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

async function updateUser(email, username, role, is_actif, id) {
  try {
    if (!email || !username || !role || !is_actif || !id) {
      return NextResponse.json({
        success: false,
        message: "Fields are required",
      });
    }
    //check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const response = await updateWithApi(`users/${id}`, {
      email,
      username,
      role,
      is_actif,
    });
    return NextResponse.json(
      { success: true, message: "User updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invternal server error" },
      { status: 500 }
    );
  }
}

async function updatePassword(
  oldPassword,
  newPassword,
  password_confirmation,
  id
) {
  if (!newPassword || !password_confirmation || !id) {
    return NextResponse.json({
      success: false,
      message: "Fields are required",
    });
  }
  if (newPassword != password_confirmation) {
    return NextResponse.json({
      success: false,
      message: "Password don't match confirmation",
    });
  }
  const response = await updateWithApi(`users/updatePassword/${id}`, {
    oldPassword,
    newPassword,
    password_confirmation,
  });
  return response;
}
