import { Request, Response, NextFunction } from "express";
import { UserModel } from "ts-auth-express";

export const allUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await UserModel.find({})
    const clientUsers = allUsers.map((clientUser) => ({
      _id: clientUser._id,
      username: clientUser.username,
      providers: clientUser.providers.map((ele) => ({
        provider: ele.provider,
        name: ele.name,
        profilePhotoURL: ele.profilePhotoURL,
        isEmailPassword: ele.isEmailPassword,
      }))
    }))
    res.status(200).json(clientUsers);
  } catch (err) {
    return next(err);
  }
};
