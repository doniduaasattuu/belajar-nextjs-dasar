export type UserResponse = {
  username: string;
  name: string;
  password?: string;
};

export type CreateUserRequest = {
  username: string;
  name: string;
  password: string;
};

export function toUserResponse(user: CreateUserRequest): UserResponse {
  return {
    username: user.username,
    name: user.name,
  };
}
