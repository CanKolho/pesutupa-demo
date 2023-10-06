import { sql } from "../database/database.js"; 

const getAllDryingRes = async () => {
  return await sql`
  SELECT *
  FROM dryingRoom
  ORDER BY start_time;`  
}

const addDryingRes = async (apartment, start_time, end_time, user_id) => {
  await sql`
    INSERT INTO dryingRoom (apartment, start_time, end_time, user_id)
    VALUES (${ apartment }, ${ start_time }, ${ end_time }, ${ user_id })`
}

export {
  getAllDryingRes,
  addDryingRes
}

