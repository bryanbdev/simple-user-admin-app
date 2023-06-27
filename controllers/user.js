// get user dashboard
export const get_user_dashboard = async (req, res) => {
  res.status(200).render("pages/dashboard");
};
