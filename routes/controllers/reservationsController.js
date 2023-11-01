import * as LaundryService from "../../services/laundryService.js";
import * as dryingService from "../../services/dryingService.js";
import { formatDate } from "../../utils/helper.js";

const showReservations = async ({ render, user }) => {
  const laundryRes = await LaundryService.getAllLaundryResByUSer(user.id);
  const dryingRes = await dryingService.getAllDryingResByUSer(user.id);

  const modifiesLaundryRes = laundryRes
    .map(res => {
      const [date, time] = formatDate(res.start_time, res.end_time);
      return {
        id: res.id,
        date,
        time,
      }
    });

  const modifiesDryingRes = dryingRes
    .map(res => {
      const [date, time] = formatDate(res.start_time, res.end_time);
      return {
        id: res.id,
        date,
        time,
      }
    });

  render("reservations.eta.html", { 
    laundryReservations: modifiesLaundryRes,
    dryingReservations: modifiesDryingRes,
  });
};

export { showReservations };
