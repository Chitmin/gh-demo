import { createContext } from "react";

interface UserContext {
  users: User[];
  update: (users: User[]) => void;
}

export const UserContext = createContext<UserContext>({
  users: [],
  update: () => {},
});
