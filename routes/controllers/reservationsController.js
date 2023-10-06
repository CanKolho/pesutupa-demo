import * as userService from "../../services/userService.js";

function formatDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const day = startDate.getDate();
  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();
  const startHours = String(startDate.getUTCHours()).padStart(2, '0');
  const startMinutes = String(startDate.getUTCMinutes()).padStart(2, '0');

  const endHours = String(endDate.getUTCHours()).padStart(2, '0');
  const endMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

const showReservations = async ({ render, user }) => {
  const rows = await userService.getAllUserReservations(user.id);

  const modifiedRows = rows
    .map(res => (
      {
        id: res.id,
        room: res.room,
        time: formatDate(res.start_time, res.end_time),
      }
    ));

  render("reservations.eta.html", { reservations: modifiedRows });
};

export { showReservations };