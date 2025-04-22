CREATE DATABASE IF NOT EXISTS climate_action_app;

USE climate_action_app;

--This only stores the user_id for now, but can be expanded to store more fields like a username/email or more specific data
--This also allows a one-to-many-or-none relationship with submissions, which can't be done by the current survey but 
--future software could continue to use this database without needing to wipe it completely
CREATE TABLE IF NOT EXISTS Users (
 user_id INT PRIMARY KEY
);

--This ties all the answers given for a given submission together
--Right now this is redundant with user_id but this is planning for potential future expansion
CREATE TABLE IF NOT EXISTS SurveySubmissions (
 id INT PRIMARY KEY,
 FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

--This stores a single field result of a calculator submissions
--Each answer is tied to a SurveySubmission entry, and there will be multiple per SurveySubmission
--This can be used for either a custom integrated carbon calculator or just asking people to report answers from an external one
CREATE TABLE IF NOT EXISTS CalculatorResults (
 field VARCHAR(255),
 result DECIMAL NOT NULL,
 PRIMARY KEY (submission_id, field),
 FOREIGN KEY (submission_id) REFERENCES SurveySubmissions(id)
);

--This stores a single field result of a calculator submissions
--Each answer is tied to a SurveySubmission entry, and there will be multiple per SurveySubmission
--question_tag is the name in the TSX code for the question
CREATE TABLE IF NOT EXISTS FormAnswers (
 question_tag VARCHAR(255),
 answer VARCHAR(255) NOT NULL,
 PRIMARY KEY (submission_id, question_tag),
 FOREIGN KEY (submission_id) REFERENCES SurveySubmissions(id)
);

--Separate table to preserve privacy
--referrer_tag is the tag of whoever shared the form with the current user and is embedded in the share link
--user_tag is the current users tag and will also be embedded as referrer_tag in their share link
CREATE TABLE IF NOT EXISTS Referrals (
 referrer_tag INT NOT NULL,
 relationship VARCHAR(100),
 user_tag INT NOT NULL,
 PRIMARY KEY (referrer_tag, user_tag)
);