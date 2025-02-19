import { prismaClient } from "@/app/database";
import { ResponseError } from "@/errors/response-error";
import {
  CreateUserRequest,
  toUserResponse,
  UserResponse,
} from "@/models/user-model";
import { UserValidation } from "@/validations/user-validation";
import { Validation } from "@/validations/validation";
import bcrypt from "bcrypt";

export class UserService {
  static async register(user: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, user);

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "Username already been taken");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    return toUserResponse(user);
  }
}
