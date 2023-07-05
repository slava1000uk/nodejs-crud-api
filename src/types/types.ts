export interface UserNoId {
  username: string;
  age: number;
  hobbies: string[];
};

export interface UserWithId extends UserNoId {
  id: string;
};