import UserModel from "../model/user.js";

// get user dashboard
export const get_user_dashboard = async (req, res) => {
  const users = await UserModel.find();
  console.log(users.username);
  res.status(200).render("pages/dashboard", { users });
};

// get update page
export const get_user_update_page = async (req, res) => {
  try {
    res.status(200).render("pages/edit");
  } catch (error) {
    console.log(error);
  }
};
