import * as userService from "../../services/userService.js";
import { create, getNumericDate} from "../../deps.js";
import { SECRET } from "../../config/config.js";
import { sendEmail } from "../../utils/email.js";

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

const processUserEmail = async ({ request, render }) => {
  const data = await getEmailData(request);

  const userFromDatabase = await userService.findUserByEmail(data.email);

  if (userFromDatabase.length != 1) {
    data.errors = ['Please check your email.'];

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

  const link = `https://reservation-app-beta.onrender.com/reset-password/${user.id}/${token}`
  
  await sendEmail(user.email, link);

  render("forgotPassword.html", { info: ['The reset-link has been sent to your email!'] });
};

export {
  showForgotPasswordForm,
  processUserEmail
};