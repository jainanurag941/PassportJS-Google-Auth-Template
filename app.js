require("dotenv").config();
const { hashSync } = require("bcrypt");
const express = require("express");
const app = express();
const UserModel = require("./config/database");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World.");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/protected",
  })
);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("protected", {
      name: req.user.name,
    });
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
  console.log(req.session);
  console.log(req.user);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
