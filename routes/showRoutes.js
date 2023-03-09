const express = require("express");
const {check, validationResult} = require("express-validator");
const {Show, User} = require("../models/index");
const {db} = require("../db");

const showRoutes = express.Router();

showRoutes.get("/", async (req, res) => {
    showList = await Show.findAll();

    if (!showList[0]) return res.json({error: "shows not found"});

    return res.json(showList);
})

showRoutes.get("/:id", async (req, res) => {
    foundShow = await Show.findByPk(req.params.id);

    if (!foundShow) return res.json({error: "show not found"});

    return res.json(foundShow);
})

showRoutes.get("/genres/:genre", async (req, res) => {
    capitalizedGenre = req.params.genre.charAt(0).toUpperCase() + req.params.genre.slice(1);
    foundShow = await Show.findAll({where:{
        genre: capitalizedGenre
    }})
    resultString = `${capitalizedGenre} shows`

    return res.json({[resultString]: foundShow});
})

showRoutes.put("/:id/updates", 
[check("status").notEmpty().trim().isLength({min: 5, max:25})],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }else{
        foundShow = await Show.findByPk(req.params.id,
        {include: User});

        if (!foundShow) return res.json({error: "show not found"});

        await foundShow.update(req.body);
    
        return res.json({["updated status"]: foundShow});
        }
})

showRoutes.put("/:id/watched",
[check("rating").notEmpty().trim()],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }else{
        foundShow = await Show.findByPk(req.params.id,
        {include: User});
        
        if (!foundShow) return res.json({error: "show not found"});

        await foundShow.update(req.body);

        return res.json({["updated rating"]: foundShow});
    }
})

showRoutes.delete("/:id", async (req, res) => {
    foundShow = await Show.findByPk(req.params.id);

    if (!foundShow) return res.json({error: "show not found"});
    
    await foundShow.destroy();

    return res.json({deleted: foundShow});
})

module.exports = showRoutes;