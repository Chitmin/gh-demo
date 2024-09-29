import { useState } from "react";
import "./App.css"
import SearchUsers from "./components/SearchUsers";
import UserList from './components/UserList';
import { UserContext } from "./Contexts";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  return <div className="container mx-auto px-12">
    <h1 className="hidden">Github User Search</h1>
    <UserContext.Provider value={{
      users,
      setUsers,
      selectUser,
      setSelectUser
    }}>
      <SearchUsers />
      <UserList />
    </UserContext.Provider>
  </div>
}
