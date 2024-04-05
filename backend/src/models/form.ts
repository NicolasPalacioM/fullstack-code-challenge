import pool from "../utils/db";

export interface FormInput {
  title: string;
  description: string;
  userId: number;
}

interface Form extends FormInput {
  formId: number;
  createdAt: Date;
  updatedAt: Date;
}

const create = async (formData: FormInput): Promise<Form> => {
  const { title, description, userId } = formData;
  const result = await pool.query<Form>(
    "INSERT INTO forms(title, description, user_id) VALUES($1, $2, $3) RETURNING *",
    [title, description, userId]
  );
  return result.rows[0];
};

const findByIdAndUpdate = async (
  formId: number,
  formData: Partial<FormInput>,
  userId: number
): Promise<Form | null> => {
  const entries = Object.entries(formData);
  const setClause = entries
    .map(([key, _], index) => `${key} = $${index + 3}`)
    .join(", ");
  const values = entries.map(([, value]) => value);

  const queryText = `
    UPDATE forms 
    SET ${setClause}
    WHERE form_id = $1 AND user_id = $2
    RETURNING *`;

  const result = await pool.query<Form>(queryText, [formId, userId, ...values]);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
};

const findByIdAndDelete = async (
  formId: number,
  userId: number
): Promise<Form | null> => {
  const result = await pool.query(
    "DELETE FROM forms WHERE form_id = $1 AND user_id = $2 RETURNING *",
    [formId, userId]
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
};

const find = async (): Promise<Form[]> => {
  const result = await pool.query("SELECT * FROM forms");
  return result.rows;
};

export const Form = {
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  find,
};
