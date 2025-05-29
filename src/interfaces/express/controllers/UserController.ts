import { Request, Response } from "express";
import { IUserService } from "../../../application/services/User";
import { CreateUserSchema } from "./User.schema";

export class UserController {
  constructor(private service: IUserService) {}

  public createUserSchema = CreateUserSchema;

  async createUser(req: Request, res: Response): Promise<void> {
    const response = await this.service.create({
      email: req.body.email,
      managerId: req.body.managerId,
    });

    res.json(response).status(201);
  }
}
