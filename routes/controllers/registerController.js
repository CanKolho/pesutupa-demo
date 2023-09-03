import * as userService from "../../services/userService.js";
import { bcrypt, validasaur } from "../../deps.js";

const registernValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(10)],
  veryfication: [validasaur.required],
};

const getRegisterData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    email: params.get('email'),
    password: params.get('password'),
    veryfication: params.get('veryfication'),
  };
};

const registerUser = async ({ request, response, render }) => {
  const registerData = await getRegisterData(request);

  const [passes, errors] = await validasaur.validate(registerData, registernValidationRules);

  const existingEmail = await userService.findUserByEmail(registerData.email);

  //If some user is already registered with particular email
  if (existingEmail.length > 0) {
    registerData.errors = ['Registration failed. Please check the information provided.'];
    render("register.eta.html", registerData);
    return;
  }

  //When password and veryfication does not match
  if (registerData.password !== registerData.veryfication) {
    registerData.errors = ['The entered passwords did not match.'];
    render("register.eta.html", registerData);
    return;
  }

  if (passes) {
    const hash = await bcrypt.hash(registerData.password);

    await userService.addUser(registerData.email, hash),

    response.redirect("/auth/login");
  } else {
    //Comes here if there occurs errors in 'registernValidationRules'
    registerData.errors = errors;
    render("register.eta.html", registerData);
  }
};

const showRegistrationForm = ({ render }) => {
  render("register.eta.html");
};

export { registerUser, showRegistrationForm };
