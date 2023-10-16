import * as userService from "../../services/userService.js";
import { formatDate } from "../../utils/helper.js";

const showReservations = async ({ render, user }) => {
  const rows = await userService.getAllUserReservations(user.id);

  const modifiedRows = rows
    .map(res => {
      const [date, time] = formatDate(res.start_time, res.end_time);
      return {
        id: res.id,
        room: res.room,
        date,
        time,
      }
    });

  render("reservations.eta.html", { reservations: modifiedRows });
};

export { showReservations };
