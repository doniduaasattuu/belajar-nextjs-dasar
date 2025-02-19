export type User = {
  username: string;
  name: string;
  password?: string;
};

export type CreateUserRequest = {
  username: string;
  name: string;
  password: string;
};
