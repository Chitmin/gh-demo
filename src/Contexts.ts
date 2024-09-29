import { createContext } from "react";

interface UserContext {
  users: User[];
  setUsers: (users: User[]) => void;
  selectUser: User | null;
  setSelectUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContext>({
  users: [],
  setUsers: () => {},
  selectUser: null,
  setSelectUser: () => {},
});
