import * as userService from "../../services/userService.js";
import { formatDate } from "../../utils/helper.js";

const showReservations = async ({ render, user }) => {
  const rows = await userService.getAllUserReservations(user.id);

  const modifiedRows = rows
    .map(res => (
      {
        id: res.id,
        room: res.room,
        date: formatDate(res.start_time, res.end_time)[0],
        time: formatDate(res.start_time, res.end_time)[1],
      }
    ));

  render("reservations.eta.html", { reservations: modifiedRows });
};

export { showReservations };