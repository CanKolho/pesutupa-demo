import { postgres } from "../deps.js";
import { DATABASE_URL } from "../config/config.js";

let sql;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL);
} else {
  sql = postgres({});
}

export { sql };
