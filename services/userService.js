import { sql } from "../database/database.js"; 

const addUser = async (email, password) => {
  await sql`INSERT INTO users (email, password) VALUES (${ email }, ${ password })`;
};

const findUserByEmail = async (email) => {
  const rows = await sql`
  SELECT *
  FROM users
  WHERE email = ${ email }`;

  return rows;
};

const getAllUserReservations = async (id) => {
  const rows = await sql`
    SELECT id, room, apartment, start_time, end_time 
    FROM laundryRoom 
    WHERE user_id = ${id}
    AND end_time > NOW()

    UNION ALL

    SELECT id, room, apartment, start_time, end_time 
    FROM dryingRoom 
    WHERE user_id = ${id}
    AND end_time > NOW()

    ORDER BY start_time`;

  return rows;
};

export { 
  addUser,
  findUserByEmail,
  getAllUserReservations, 
};