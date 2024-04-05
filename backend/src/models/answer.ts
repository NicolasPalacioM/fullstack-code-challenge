import pool from "../utils/db";

export interface AnswerInput {
  questionId: number;
  userId: number;
  content: string;
}

interface Answer extends AnswerInput {
  answerId: number;
  createdAt: Date;
  updatedAt: Date;
}

const create = async (answerData: AnswerInput): Promise<Answer> => {
  const { questionId, userId, content } = answerData;
  const result = await pool.query<Answer>(
    "INSERT INTO answers(question_id, user_id, content) VALUES($1, $2, $3) RETURNING *",
    [questionId, userId, content]
  );
  return result.rows[0];
};

const findByIdAndUpdate = async (
  answerId: number,
  content: string,
  userId: number
): Promise<Answer | null> => {
  const queryText = `
  UPDATE answers
  SET content = $2
  WHERE answer_id = $1 AND user_id = $3
  RETURNING *`;

  const result = await pool.query<Answer>(queryText, [
    answerId,
    content,
    userId,
  ]);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
};

const findByIdAndDelete = async (
  answerId: number,
  userId: number
): Promise<Answer | null> => {
  const result = await pool.query(
    "DELETE FROM answers WHERE answer_id = $1 AND user_id = $2 RETURNING *",
    [answerId, userId]
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
};

const findByQuestion = async (userId: number): Promise<Answer[]> => {
  const result = await pool.query(
    "SELECT * FROM answers WHERE question_id = $1",
    [userId]
  );
  return result.rows;
};

const findByUser = async (userId: number): Promise<Answer[]> => {
  const result = await pool.query("SELECT * FROM answers WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
};

export const Answer = {
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  findByQuestion,
  findByUser,
};
