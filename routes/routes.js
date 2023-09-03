import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as loginController from "./controllers/loginController.js";
import * as registerController from "./controllers/registerController.js";
import * as reservationsController from "./controllers/reservationsController.js";
import * as logoutController from "./controllers/logoutController.js";
import * as laundryController from "./controllers/laundryController.js";
import * as dryingController from "./controllers/dryingController.js";
import * as RulesController from "./controllers/rulesController.js";

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
  
export { router };
