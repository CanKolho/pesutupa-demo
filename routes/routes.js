import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as loginController from "./controllers/loginController.js";
import * as registerController from "./controllers/registerController.js";
import * as reservationsController from "./controllers/reservationsController.js";
import * as logoutController from "./controllers/logoutController.js";
import * as laundryController from "./controllers/laundryController.js";
import * as dryingController from "./controllers/dryingController.js";
import * as RulesController from "./controllers/rulesController.js";
import * as laundryApi from "./apis/laundryApi.js";
import * as dryingApi from "./apis/dryingApi.js";
import * as resetPasswordController from "./controllers/resetPasswordController.js";

const router = new Router();

router.get("/", mainController.showMain);

//Login related
router
  .get("/auth/login", loginController.showLoginForm)
  .post("/auth/login", loginController.processLogin);

//Registration related
router
  .get("/auth/register", registerController.showRegistrationForm)
  .post("/auth/register", registerController.registerUser);

//Logout related
router
  .post("/auth/logout", logoutController.logout);

//Reservations related
router
  .get("/reservations", reservationsController.showReservations);

//Laundry room related
router
  .get("/laundry", laundryController.showLaundryCalendar);

  //Drying room related
router
.get("/drying", dryingController.showDryingCalendar);

//Rules room related
router
  .get("/rules", RulesController.showRules);

router
  .get("/api/laundryroom", laundryApi.getAllLaundryRes)
  .post("/api/laundryroom", laundryApi.addLaundryRes)
  .post("/api/laundryroom/delete/:rID", laundryApi.deletelaundryRes); //HTTP DELETE

router
  .get("/api/dryingroom", dryingApi.getAllDryingRes)
  .post("/api/dryingroom", dryingApi.addDryingRes)
  .post("/api/dryingroom/delete/:rID", dryingApi.deletedryingRes); //HTTP DELETE

router
  .get("/forgot-password", resetPasswordController.showForgotPasswordForm)
  .post("/forgot-password", resetPasswordController.processUserEmail)
  .get("/reset-password/:id/:token", resetPasswordController.showResetPasswordForm)
  .post("/reset-password/:id/:token", resetPasswordController.processNewPassword);

export { router };
