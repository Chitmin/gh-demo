import { useContext } from "react";
import { UserContext } from "../Contexts";

const UserList= () => {
    const { users } = useContext(UserContext);

    return <section id="user-list">
        <h1>Users</h1>
        {users.length ? 
        <ul id="users">
            {users.map((user) => <li key={user.id}>
                <img src={user.avatarUrl} alt={user.login} />
                <a href={user.url} target="_blank">{user.login}</a>
            </li>)}
        </ul> : ""}
    </section>
}

export default UserList;
