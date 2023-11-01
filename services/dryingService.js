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

const deleteDryingRes = async (id, user_id) => {
  await sql`
    DELETE FROM dryingRoom
    WHERE id = ${id}
    AND user_id = ${user_id}`;
};

const getAllDryingResByUSer = async (id) => {
  const rows = await sql`
    SELECT id, room, apartment, start_time, end_time 
    FROM dryingRoom 
    WHERE user_id = ${id}
    AND end_time > NOW()

    ORDER BY start_time`;

  return rows;
}

export {
  getAllDryingRes,
  addDryingRes,
  deleteDryingRes,
  getAllDryingResByUSer,
}

