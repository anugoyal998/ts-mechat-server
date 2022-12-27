import { Request, Response, NextFunction } from "express";
import Joi from "joi"
import ChatModel from "../models/chat.model"


export const sendMsgController = async (
    req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const sender = req.user?.username
        const sendMsgSchema = Joi.object({
            reciever: Joi.string(),
            msg: Joi.string(),
            msgType: Joi.string(),
        })
        const { error } = sendMsgSchema.validate(req.body)
        if(error){
            return next(error)
        }
        const { reciever, msg, msgType} = req.body
        const chat = new ChatModel({ sender, reciever, msg, msgType})
        await chat.save()
        return res.status(200).json("msg created successfully")
    } catch (err) {
        return next(err);
    }
}