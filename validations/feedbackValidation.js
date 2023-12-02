const { body, validationResult } = require("express-validator");

exports.ValidateaddFeedback  = [
    body("title").notEmpty().withMessage("Title is required!"),
    body("description").notEmpty().withMessage("Password is required"),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors){
            return res.status(400).json({errors:errors.array()});
        }
        next();
    }
]