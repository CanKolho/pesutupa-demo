import * as userService from "../../services/userService.js";
import { validasaur, verify } from "../../deps.js";
import { SECRET } from "../../config/config.js";
import { bcrypt } from "../../deps.js";

const passwordValidationRules = {
  newPassword: [validasaur.required, validasaur.minLength(10)],
  passwordConfirmation: [validasaur.required],
};

const getPasswordData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    newPassword: params.get('newPassword'),
    passwordConfirmation: params.get('confirmPassword'),
  };
};

const showResetPasswordForm = async ({ render, params }) => {
  const { id, token } = params;
  
  const userFromDatabase = await userService.findUserByID(id);

  if (userFromDatabase.length != 1) {
    render('resetPassword.html', { 
      errors: ['Something went wrong...'] 
    });
    return;
  }

  try {
    const payload = await verify(token, SECRET);
    render('resetPassword.html', { email: payload.email })
  } catch (error) {
    const err = ['The Link You Followed Has Expired!'];
    render('resetPassword.html', { errors: err });
  }
};

const processNewPassword = async ({ request, render, params, response }) => {
  const { id, token } = params;
  const passwordData = await getPasswordData(request);

  //passwordErrors are not currently used!
  const [passes, passwordErrors] = await validasaur.validate(passwordData, passwordValidationRules);

  const userFromDatabase = await userService.findUserByID(id);

  if (userFromDatabase.length != 1) {
    render('resetPassword.html', {
      errors: ['Something went wrong...'] 
    });
    return;
  }

  try {
    const payload = await verify(token, SECRET);

    //Need to check here both validations because of the payload email
    if (passwordData.newPassword !== passwordData.passwordConfirmation) {
      render('resetPassword.html', {
        email: payload.email,
        PWerrors: ['The entered passwords did not match.']
      });
      return;
    }

    //passwordErrors should be used here
    if (!passes) {
      render('resetPassword.html', { 
        email: payload.email,
        PWerrors: ['Validation failed!']
      });
      return;
    }

    //If passwords are valid, the newPassword gets hashed
    const hash = await bcrypt.hash(passwordData.newPassword);
    await userService.resetPassword(payload.id, hash);

    response.redirect("/auth/login");
  } catch (error) {
    render('resetPassword.html', { 
      errors: ['The Link You Followed Has Expired!']
    });
  }
};

export {
  showResetPasswordForm,
  processNewPassword,
};