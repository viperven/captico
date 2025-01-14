const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

//ALL ROUTES
app.use("/auth", require("./src/routes/user"));
app.use("/course", require("./src/routes/course"));

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("database connection error", err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});
