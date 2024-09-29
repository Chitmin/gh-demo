import { useState } from "react";
import "./App.css";
import SearchUsers from "./components/SearchUsers";
import UserList from "./components/UserList";
import { UserContext, RepoContext } from "./Contexts";
import UserRepolist from "./components/UserRepoList";
import IssueList from "./components/IssueList";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const [repo, setRepo] = useState<Repo | null>(null);

  return (
    <div className="container mx-auto px-12">
      <h1 className="hidden">Github User Search</h1>
      <UserContext.Provider
        value={{
          users,
          setUsers,
          selectUser,
          setSelectUser,
        }}
      >
        <SearchUsers />
        <UserList />
        <RepoContext.Provider value={{ repo, setRepo }}>
          {selectUser && !repo && <UserRepolist login={selectUser.login} />}
          {selectUser && repo && (
            <IssueList owner={selectUser?.login} repo={repo} />
          )}
        </RepoContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
