import * as dryingService from "../../services/dryingService.js"
import { timeParser, isValidTitle } from "../../utils/helper.js";

const getAllDryingRes = async ({ response }) => {
  try {
    const reservations = await dryingService.getAllDryingRes()

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

const addDryingRes = async ({ request, response, user }) => {
  const body = request.body({ type: 'json' });
  const content = await body.value;
  
  /**
    * If title is not in correct format.
    */
  if (!isValidTitle(content.title)) {
    response.body = { error: "Invalid title format." };
    response.status = 400;
    return;
  }
  
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
  * Checks that reservations made to laundryroom is between 06:00 - 22:00
  */
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  const isStartTimeValid = startHour >= 6;
  const isEndTimeValid = endHour < 22 || (endHour === 22 && endMinutes === 0);

  if (!isStartTimeValid || !isEndTimeValid) {
    response.body = { error: "Reservation must be between 06:00 and 22:00." };
    response.status = 400;
    return;
  }

  try {
    /**
    * If no error occurs (1. start is before end, 2. reservation is between 6-22, 3. does not overlap with existing reservation in database)
    * then reservation is added to database!
    */
    await dryingService.addDryingRes(content.title, content.start_time, content.end_time, user.id)

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

const deletedryingRes = async ({ response, params, user }) => {
  await dryingService.deleteDryingRes(params.rID, user.id)

  response.status = 204;
  response.redirect('/reservations');
};

export {
  getAllDryingRes,
  addDryingRes,
  deletedryingRes,
}
