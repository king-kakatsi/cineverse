import { NextResponse } from "next/server";
import { deleteWithApi, getFromApi, updateWithApi } from "./axiosService";

export const adminServices = {
  getUsers,
  updateUserRole,
  deleteUser,
  updateUser,
};

async function getUsers() {
  try {
    const users = await getFromApi("users");
    if (users) {
      return NextResponse.json(
        {
          success: true,
          users: users[1].data,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occured",
      },
      { status: 500 }
    );
  }
}

async function updateUserRole(id, newRole) {
  try {
    if (!newRole || !id) {
      return NextResponse.json(
        {
          success: false,
          error: "Rule and user a required",
        },
        {
          status: 400,
        }
      );
    }

    if (newRole != "admin" && newRole != "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Role not define",
        },
        {
          status: 404,
        }
      );
    }
    const response = await updateWithApi(`users/updateRole/${id}`, newRole);
    if (response[1].success) {
      return NextResponse.json(
        {
          success: true,
          message: "user rule updated",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "user rule not updated",
        },
        {
          status: 400,
        }
      );
    }
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

async function deleteUser(id) {
  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "user is required",
        },
        {
          status: 400,
        }
      );
    }
    const response = await deleteWithApi(`users/${id}`, {});
    return NextResponse.json(
      {
        success: true,
        error: "user is deleted",
      },
      {
        status: 204,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
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
      { success: false, message: "User updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invternal server error" },
      { status: 500 }
    );
  }
}
