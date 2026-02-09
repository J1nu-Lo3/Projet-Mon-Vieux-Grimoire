const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://J1nu-Lo3:ajFyfYpkV6F6g0Zs@cluster0.jh3i0gr.mongodb.net/test?retryWrites=true&w=majority",
  )
  .then(() => console.log("Connexion à MongoDB Atlas réussie !"))
  .catch((error) =>
    console.error("Connexion à MongoDB Atlas échouée !", error),
  );

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
