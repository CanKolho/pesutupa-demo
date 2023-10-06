import { sql } from "../database/database.js"; 

const getAllLaundryRes = async () => {
  return await sql`
  SELECT *
  FROM laundryRoom
  ORDER BY start_time;`  
}

const addLaundryRes = async (apartment, start_time, end_time, user_id) => {
  await sql`
    INSERT INTO laundryRoom (apartment, start_time, end_time, user_id)
    VALUES (${ apartment }, ${ start_time }, ${ end_time }, ${ user_id })`
}

const deletelaundryRes = async (id, user_id) => {
  await sql`
    DELETE FROM laundryRoom
    WHERE id = ${id}
    AND user_id = ${user_id}`;
};

export {
  getAllLaundryRes,
  addLaundryRes,
  deletelaundryRes
}

