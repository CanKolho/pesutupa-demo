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

export {
  getAllLaundryRes,
  addLaundryRes
}

