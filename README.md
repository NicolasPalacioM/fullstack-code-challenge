# Limbic Fullstack Code Challenge

This is Limbic’s FullStack Challenge that combines bits from the frontend and backend challenges in one.

Jane is a clinical therapist and wants her clients to answer simple questionnaires in order to better understand them. She needs a way to add/delete/edit questions and also see the answers of each client.

## Backend 

You are tasked with writing an API to create/edit/delete Users, Questions, and Answers. It should be a NodeJS/ExpressJS server with the following endpoints:

- Return all the users. (No need for other user endpoints, just create a sample set of users locally or in the db if you choose one)
- Create a new Question
- Edit a Question
- Delete a Question
- Create a user Answer
- Edit a user Answer
- Delete a user Answer
- Return all the answers of a user

**Stack Options:**

1. TypeScript, NodeJS, Apollo GraphQL, Jest / Mocha-Chai
2. TypeScript, NodeJS, ExpressJS, Jest / Mocha-Chai

🔎 **Things we're looking for:**

It should be production quality as you understand it, i.e. tests, Docker, README, documentation, etc.

- TypeScript
- Project Structure
- Unit Tests
- API Design
- Error Handling

🏆 **BIG PLUS:**

We don't care for data persistence at this point so you could just save everything in variables locally, but it's a big plus if you can also **save and read the data from a MongoDB or PostgreSQL database.**

## Frontend

You are tasked with writing a React/React Native app to consume the backend API. Your app should be able to complete the following tasks:

- See a list of users
- See a list of questions
- add a new question
- edit a question
- delete a question
- see all the answers of a user
- add a new answer
- delete an answer

🔎 **Things we're looking for:**

- TypeScript
- Project Structure
- Components Structure
- State Management
- Separation of concerns
- Data Handling

🏆 **BIG PLUS:**

You can use anything you want for state management. We use MobX and the Context API a lot so it's a big plus if you can also **implement some/all of the state handling with MobX and Context API**.


## Instructions

1. **Submitting Code**

   **Option A:**

   - Fork this repo
   - Issue a Pull Request on the repo when you're ready to start. This will count as your starting date.
   - For the frontend, setup your development environment for React or React Native in a **frontend** folder
   - For the backend, setup your development environment for NodeJS with ExpressJS in a **backend** folder
   - Implement your solution on each end
   - Commit your changes into the forked repo

   **Option B:**

   - For the frontend, setup your development environment for React or React Native in a **frontend** folder
   - For the backend, setup your development environment for NodeJS with ExpressJS in a **backend** folder
   - Implement your solution for each end
   - Archive the **frontend** and **backend** folders into a zip file
   - Send us the zip file. We should be able to extract the content of each folder and run it from there (w/o node_modules)

2. **Deadline:**

   You have 1 week to complete as much tasks as you can from the challenge below. Countdown starts from date you issued the PR or from the date you were invited to complete this challenge via email

3. **Implementation:**

   There is no correct way to do the challenge, you are free to add whatever libraries you like besides the ones mentioned below. We want to see what you come up with on your own.
