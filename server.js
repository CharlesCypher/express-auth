const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const employees = require("./routes/api/employees");
const users = require("./routes/api/users");
const register = require("./routes/auth/register");
const login = require("./routes/auth/login");
const refresh = require("./routes/auth/refresh");
const logout = require("./routes/auth/logout");
const verifyJWT = require("./middleware/verifyJWT");
const connectDB = require("./config/dbConn");
const credentials = require("./middleware/credentials");
const globalError = require("./middleware/globalError");
require("dotenv").config();

const PORT = process.env.PORT || 3510;

connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/api/auth/login", login);
app.use("/v1/api/auth/logout", logout);
app.use("/v1/api/auth/refresh", refresh);
app.use("/v1/api/auth/register", register);

app.use(verifyJWT);
app.use("/v1/api/employees", employees);
app.use("/v1/api/users", users);
// app.all('*', (req, res) => {
//   res.status(404);
//   if (req.accepts('html')) {
//       res.sendFile(path.join(__dirname, 'views', '404.html'));
//   } else if (req.accepts('json')) {
//       res.json({ "error": "404 Not Found" });
//   } else {
//       res.type('txt').send("404 Not Found");
//   }
// });

// app.use((_req, res) => {
//   res.status(404).json({ success: false, message: "Not Found" });
// });
app.use(globalError);

mongoose.connection.once("open", () => {
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
