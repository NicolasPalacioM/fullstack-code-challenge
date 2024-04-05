import pool from "../utils/db";

interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

const find = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM questions");
  return result.rows;
};

export const User = {
  find,
};
