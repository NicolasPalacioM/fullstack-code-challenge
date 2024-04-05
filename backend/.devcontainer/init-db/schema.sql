-- Table for users, now including a password field
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- New table for forms
CREATE TABLE forms (
    form_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers and functions for updating 'updated_at' timestamp in questions and answers
CREATE OR REPLACE FUNCTION update_forms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forms_before_update
BEFORE UPDATE ON forms
FOR EACH ROW EXECUTE FUNCTION update_forms_timestamp();


-- Modified table for questions to include the form_id foreign key in the creation statement
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    form_id INTEGER REFERENCES forms(form_id) ON DELETE SET NULL, -- Integrated foreign key constraint
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers and functions for updating 'updated_at' timestamp in questions and answers
CREATE OR REPLACE FUNCTION update_question_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_before_update
BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION update_question_timestamp();

-- Table for answers and its update trigger remains the same
CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    question_id INTEGER REFERENCES questions(question_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_answer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_answer_before_update
BEFORE UPDATE ON answers
FOR EACH ROW EXECUTE FUNCTION update_answer_timestamp();


INSERT INTO users (username, email, password) VALUES 
('johndoe', 'johndoe@example.com', 'password123'),
('janedoe', 'janedoe@example.com', 'password456'),
('alexsmith', 'alexsmith@example.com', 'password789');

INSERT INTO forms (title, description, user_id) VALUES 
('Customer Feedback', 'Form to collect customer feedback.', 1),
('Employee Survey', 'Survey for employee satisfaction.', 2),
('Event Registration', 'Form for event registration.', 3);

INSERT INTO questions (content, user_id, form_id) VALUES 
('How satisfied are you with our service?', 1, 1),
('What can we do to improve?', 1, 1),
('Rate your work-life balance.', 2, 2),
('Would you recommend working here to a friend?', 2, 2),
('What events are you interested in?', 3, 3);

INSERT INTO answers (content, question_id, user_id) VALUES 
('Very satisfied', 1, 2),
('Improve customer support.', 2, 2),
('Balanced', 3, 1),
('Yes, definitely!', 4, 1),
('Tech Talks and Workshops', 5, 2);
