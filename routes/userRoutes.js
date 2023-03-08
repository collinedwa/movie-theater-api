const express = require("express");
const {check, validationResult} = require("express-validator");
const {User, Show} = require("../models/index");
const {db} = require("../db");

const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
    userList = await User.findAll();

    res.json(userList);
})

userRoutes.get("/:id", async (req, res) => {
    foundUser = await User.findByPk(req.params.id);

    res.json(foundUser);
})

userRoutes.get("/:id/shows", async (req, res) => {
    foundUser = await User.findByPk(req.params.id,{
        include: Show});
    
    resultString = `shows watched by ${foundUser.username}`;

    res.json({[resultString]: foundUser.shows});
})

userRoutes.put("/:id/shows/:sid", async (req, res) => {
    foundUser = await User.findByPk(req.params.id, {
        include: Show});
    await foundUser.addShow(req.params.sid);
    foundShow = await Show.findByPk(req.params.sid);
    resultString = `added to ${foundUser.username}'s list`

    res.json({[resultString]: foundShow});
})

module.exports = userRoutes;