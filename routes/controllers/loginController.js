import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

/**
 * Retrieves login data from the request body.
 * @param {Request} request - The request object.
 * @returns {Object} - An object containing the email and password.
 */
const getLoginData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    email: params.get('email'),
    password: params.get('password'),
  };
};

const processLogin = async ({ request, response, state, render }) => {
  const loginData = await getLoginData(request);

  const userFromDatabase = await userService.findUserByEmail(loginData.email);

  if (userFromDatabase.length !== 1) {
    loginData.errors = ['Email not found. Please check your email or register.'];

    render("login.eta.html", loginData);
    return;
  }

  const user = userFromDatabase[0];
  const hashFromDatabase = user.password;

  const passwordMatches = await bcrypt.compare(loginData.password, hashFromDatabase);

  if (!passwordMatches) {
    loginData.errors = ['Incorrect password. Please try again.'];

    render("login.eta.html", loginData);
    return;
  }

  //Both email and password are valid

  //Deleting password from user-Object that only has properties { id, email } in session storage
  delete user.password;

  await state.session.set('user', user);
  response.redirect('/reservations');
};

const showLoginForm = async ({ request, render }) => {
  render("login.eta.html", await getLoginData(request));
};

export { showLoginForm, processLogin };
