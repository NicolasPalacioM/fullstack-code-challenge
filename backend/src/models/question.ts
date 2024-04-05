import pool from "../utils/db";

export interface QuestionInput {
  formId: number;
  userId: number;
  content: string;
}

interface Question extends QuestionInput {
  questionId: number;
  createdAt: Date;
  updatedAt: Date;
}

const create = async (questionData: QuestionInput): Promise<Question> => {
  const { content, userId, formId } = questionData;
  const result = await pool.query<Question>(
    "INSERT INTO questions(content, user_id, form_id) VALUES($1, $2, $3) RETURNING *",
    [content, userId, formId]
  );
  return result.rows[0];
};

const findByIdAndUpdate = async (
  questionId: number,
  content: string,
  userId: number
): Promise<Question | null> => {
  const queryText = `
  UPDATE questions
  SET content = $2
  WHERE question_id = $1 AND user_id = $3
  RETURNING *`;

  const result = await pool.query<Question>(queryText, [
    questionId,
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
  questionId: number,
  userId: number
): Promise<Question | null> => {
  const result = await pool.query(
    "DELETE FROM questions WHERE question_id = $1 AND user_id = $2 RETURNING *",
    [questionId, userId]
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
     If no rows are returned, the question either doesn't exist or the userId doesn't match
    return null;
  }
};

const findByForm = async (formId: number): Promise<Question[]> => {
  const result = await pool.query(
    "SELECT * FROM questions` WHERE form_id = $1",
    [formId]
  );
  return result.rows;
};

export const Question = {
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  findByForm,
};
