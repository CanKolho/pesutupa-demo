const logout = async ({ response, state }) => {
  await state.session.deleteSession();
  response.redirect("/");
};

export {
  logout
};