import { useContext } from "react";
import { UserContext } from "../Contexts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserList = () => {
  const { users, selectUser, setSelectUser } = useContext(UserContext);

  const styles = (user: User) =>
    user.id === selectUser?.id
      ? {
          avatar: "h-40 w-40 rounded-none mb-2 p-2 shadow-lg",
          name: "mb-2 text-sky-400",
        }
      : {
          avatar: "h-40 w-40 rounded-none mb-2 p-2",
          name: "mb-2 text-inherit",
        };

  return (
    <section id="user-list" className="p-4 mb-8">
      {users.length ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <ul id="users" className="flex flex-wrap justify-center">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-wrap flex-col items-center hover:cursor-pointer"
                onClick={() => setSelectUser(user)}
              >
                <Avatar className={styles(user).avatar}>
                  <AvatarImage src={user.avatarUrl} alt={user.login} />
                  <AvatarFallback>{user.login}</AvatarFallback>
                </Avatar>
                <span className={styles(user).name}>{user.login}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        ""
      )}
    </section>
  );
};

export default UserList;
