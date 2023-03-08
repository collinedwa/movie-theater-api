const express = require("express");
const {check, validationResult} = require("express-validator");
const app = express();
const {db} = require("./db");
const userRoutes = require("./routes/userRoutes");
const showRoutes = require("./routes/showRoutes");

const port = 3000;
app.use(express.json());
app.use("/users", userRoutes);
app.use("/shows", showRoutes);


app.listen(port, () => {
    db.sync();
    console.log("Your server is listening on port " + port);
})