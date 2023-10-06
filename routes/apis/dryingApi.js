import * as dryingService from "../../services/dryingService.js"

//Helper function
const timeParses = time => {
  const date = time.split(' ')[0].split('-'); //2023-10-5 12:30 => [2023, 10, 5]
  const year = Number(date[0]);
  const month = Number(date[1]);
  const day = Number(date[2]);

  return { year, month, day };
};

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

  try {
    await dryingService.addDryingRes(content.title, content.start_time, content.end_time, user.id)

    const date = timeParses(content.start_time);

    response.body = {
      title: content.title,
      time: content.time,
      year: date.year,
      month: date.month,
      day: date.day,
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