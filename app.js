const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const need = require("./routes/needs");
const user = require("./routes/user");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", (_, res, next) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", user);
app.use("/api/needs", need);
module.exports = app;
