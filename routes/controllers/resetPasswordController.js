import * as userService from "../../services/userService.js";
import { create, verify, getNumericDate} from "../../deps.js";
import { SECRET } from "../../config/config.js";
import { bcrypt } from "../../deps.js";
import { sendEmail } from "../../utils/email.js";

//TODO 
/**
 * Datan validointi
 * kaksi newpassword inputtia
 * error messaget kuntoon
 * styles
 * 
 */
const getEmailData = async (request) => {
  const body = request.body({ type: 'form'});
  const params = await body.value;

  return { 
    email: params.get('email')
  };
};

const showForgotPasswordForm = async ({request, render }) => {
  render('forgotPassword.html', await getEmailData(request))
};

const processUserEmail = async ({ request, response, render }) => {
  const data = await getEmailData(request);

  const userFromDatabase = await userService.findUserByEmail(data.email);

  if (userFromDatabase.length != 1) {
    data.errors = ['Something went wrong. Please check your email.'];

    render("forgotPassword.html", data);
    return;
  }

  const user = userFromDatabase[0];

  const payload = {
    email: user.email,
    id: user.id,
    exp: getNumericDate(600) //10min
  };

  const header = { alg: "HS512", typ: "JWT" };

  const token = await create(header, payload, SECRET);

  const link = `http://localhost:7777/reset-password/${user.id}/${token}`
  
  await sendEmail(user.email, link);

  render("forgotPassword.html", { info: ['The reset-link has been sent to your email!'] });
};

const showResetPasswordForm = async ({ request, render, params, response }) => {
  const { id, token } = params;
  
  const userFromDatabase = await userService.findUserByID(id);

  if (userFromDatabase.length != 1) {
    const err = ['Something went wrong...'];

    render('resetPassword.html', { errors: err });
    return;
  }

  try {
    const payload = await verify(token, SECRET);
    render('resetPassword.html', { email: payload.email })
  } catch (error) {
    const err = ['Something went wrong...'];
    render('resetPassword.html', { errors: err });
  }
};

const processNewPassword = async ({ request, render, params, response }) => {
  const { id, token } = params;

  const body = request.body({ type: 'form'});
  const reqParams = await body.value;
  const newPassword = reqParams.get('newPassword');

  const userFromDatabase = await userService.findUserByID(id);

  if (userFromDatabase.length != 1) {
    const err = ['Something went wrong...'];

    render('resetPassword.html', { errors: err });
    return;
  }

  try {
    const payload = await verify(token, SECRET);
    const hash = await bcrypt.hash(newPassword);

    await userService.resetPassword(payload.id, hash);

    response.redirect("/auth/login");
  } catch (error) {
    const err = ['Something went wrong...'];
    render('resetPassword.html', { errors: err });
  }
};

export {
  showForgotPasswordForm,
  processUserEmail,
  showResetPasswordForm,
  processNewPassword,
};