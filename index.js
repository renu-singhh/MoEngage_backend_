const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/userRoutes");
const listRouter = require("./routes/listRoutes");
const { connectDB, disconnectDB } = require("./db/mongodb");

dotenv.config();
const port = process.env.PORT || 5500;
const mongoURI = process.env.MONGO_URI;
const live = process.env.LIVE || "http://localhost:";

const app = express();
app.use(cors());
app.use(express.json());

// Serve the root
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // If no token, return unauthorized

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, return forbidden
    req.user = user; // Attach user data to the request object
    next();
  });
};

app.get("/profile", authenticateToken, (req, res) => {
  const userEmail = req.user.email; // Extract email from the user object
  res.json({ email: userEmail });
});

// Use user routes
app.use("/user/auth", authRouter);
app.use("/lists", listRouter);
const start = async () => {
  try {
    if (!mongoURI) {
      console.error("MONGO_URI environment variable is not set.");
      process.exit(1);
    }
    await connectDB(mongoURI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log(`Go Live: ${live}${port}/`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

start();

process.on("SIGINT", () => {
  console.log("Shutting down gracefully");
  disconnectDB();
  process.exit(0);
});
