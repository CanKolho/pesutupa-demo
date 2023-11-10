import * as laundryService from "../../services/laundryService.js";
import { timeParser } from "../../utils/helper.js";

const getAllLaundryRes = async ({ response }) => {
  try {
    const reservations = await laundryService.getAllLaundryRes()

    if (!reservations) {
      response.body = {};
      return;
    }

    const modifiedRes = reservations.map(res => {
      const startTime = new Date(res.start_time).toISOString().substring(11, 16);
      const endTime = new Date(res.end_time).toISOString().substring(11, 16);

      return {
        title: res.apartment,
        time: `${startTime} - ${endTime}`,
        year: res.start_time.getFullYear(),
        month: res.start_time.getMonth() + 1, //offset is 1
        day: res.start_time.getDate(),
      };
    })

    response.body = modifiedRes;
  } catch (error) {
    response.body = { error: error.message };
    response.status = 500; // Internal Server Error
  }
}

const addLaundryRes = async ({ request, response, user }) => {
  const body = request.body({ type: 'json' });
  const content = await body.value;

  /**
  * Checks that start is before end.
  */
  const startTime = new Date(content.start_time);
  const endTime = new Date(content.end_time);

  if (startTime >= endTime) {
    response.body = { error: "Start time must be before end time." };
    response.status = 400;
    return;
  }

  if (startTime.getFullYear() !== endTime.getFullYear() ||
      startTime.getMonth() !== endTime.getMonth() ||
      startTime.getDate() !== endTime.getDate()) {
        
      response.body = { error: "Start and End must be on the same date." };
      response.status = 400;
      return;
    }

  /**
   * Checks that reservations made to laundryroom is between 06:00 - 21:00
   */
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  const isStartTimeValid = startHour > 6 || (startHour === 6 && startMinutes === 0);
  const isEndTimeValid = endHour < 21 || (endHour === 21 && endMinutes === 0);

  if (!isStartTimeValid || !isEndTimeValid) {
    response.body = { error: "Reservation must be between 06:00 and 21:00." };
    response.status = 400;
    return;
  }

  try {
    /**
     * If no error occurs (1. start is before end, 2. reservation is between 6-21, 3. does not overlap with existing reservation in database)
     * then reservation is added to database!
     */
    await laundryService.addLaundryRes(content.title, content.start_time, content.end_time, user.id)

    const { year, month, day } = timeParser(content.start_time);

    response.body = {
      title: content.title,
      time: content.time,
      year,
      month,
      day
    };

  } catch (error) {
    response.body = { error: error.message };
    response.status = 409;
  }
}

const deletelaundryRes = async ({ response, params, user }) => {
  await laundryService.deletelaundryRes(params.rID, user.id);

  response.status = 204;
  response.redirect('/reservations');
};

export {
  getAllLaundryRes,
  addLaundryRes,
  deletelaundryRes,
}
