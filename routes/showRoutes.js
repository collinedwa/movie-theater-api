const express = require("express");
const {check, validationResult} = require("express-validator");
const {Show, User} = require("../models/index");
const {db} = require("../db");

const showRoutes = express.Router();

showRoutes.get("/", async (req, res) => {
    showList = await Show.findAll();

    res.json(showList);
})

showRoutes.get("/:id", async (req, res) => {
    foundShow = await Show.findByPk(req.params.id);

    res.json(foundShow);
})

showRoutes.get("/genres/:genre", async (req, res) => {
    foundShow = await Show.findAll({where:{
        genre: req.params.genre
    }})
    resultString = `${req.params.genre} shows`

    res.json({[resultString]: foundShow});
})

showRoutes.put("/:id/updates", 
[check("status").notEmpty().trim().isLength({min: 5, max:25})],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.json({errors: errors.array()});
    }else{
        foundShow = await Show.findByPk(req.params.id,
        {include: User});

        await foundShow.update(req.body);
    
        res.json({["updated status"]: foundShow});
        }
})

showRoutes.put("/:id/watched",
[check("rating").notEmpty().trim()],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.json({errors: errors.array()});
    }else{
        foundShow = await Show.findByPk(req.params.id,
        {include: User});
        
        await foundShow.update(req.body);

        res.json({["updated rating"]: foundShow});
    }
})

showRoutes.delete("/:id", async (req, res) => {
    foundShow = await Show.findByPk(req.params.id);
    await foundShow.destroy();

    res.json({deleted: foundShow});
})

module.exports = showRoutes;