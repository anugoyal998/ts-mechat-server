import { Request, Response, NextFunction } from "express";
import Joi from "joi"
import ChatModel from "../models/chat.model"


export const getMsgsController = async (
    req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const sender = req.user?.username
        const getMsgsSchema = Joi.object({
            reciever: Joi.string()
        })
        const { error } = getMsgsSchema.validate(req.body)
        if(error){
            return next(error)
        } 
        const { reciever } = req.body
        const msgs1 = await ChatModel.find({ sender, reciever }).select("-updatedAt -__v -_id");
        const msgs2 = await ChatModel.find({
            sender: reciever,
            reciever: sender,
        }).select("-updatedAt -__v -_id");  
        const msgs = msgs1.concat(msgs2);
        return res.status(200).json(msgs)
    } catch (err) {
        return next(err);
    }
}