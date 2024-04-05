import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { questionRoutes } from "./routes/questionRoutes";
import { answerRoutes } from "./routes/answerRoutes";
import { userRoutes } from "./routes/userRoutes";
import { formRoutes } from "./routes/formRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors());

app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/users", userRoutes);
app.use("/forms", formRoutes);

// Catch-all for non-existing routes
app.use("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
