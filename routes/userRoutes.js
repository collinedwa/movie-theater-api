const express = require("express");
const {check, validationResult} = require("express-validator");
const {User, Show} = require("../models/index");
const {db} = require("../db");

const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
    userList = await User.findAll();

    if (!userList[0]) return res.json({error: "users not found"});

    return res.json(userList);
})

userRoutes.get("/:id", async (req, res) => {
    foundUser = await User.findByPk(req.params.id);
    
    if (!foundUser) return res.json({error: "user not found"});

    return res.json(foundUser);
})

userRoutes.get("/:id/shows", async (req, res) => {
    foundUser = await User.findByPk(req.params.id,{
        include: Show});

    if (!foundUser) return res.json({error: "user not found"});
    
    resultString = `shows watched by ${foundUser.username}`;

    return res.json({[resultString]: foundUser.shows});
})

userRoutes.put("/:id/shows/:sid", async (req, res) => {
    foundUser = await User.findByPk(req.params.id, {
        include: Show});

    // initialized to check if show exists before adding to user's list
    foundShow = await Show.findByPk(req.params.sid);

    if (!foundUser) return res.json({error: "user not found"});
    if (!foundShow) return res.json({error: "show not found"});

    
    await foundUser.addShow(req.params.sid);
    foundShow = await Show.findByPk(req.params.sid);
    resultString = `added to ${foundUser.username}'s list`

    return res.json({[resultString]: foundShow});
})

module.exports = userRoutes;