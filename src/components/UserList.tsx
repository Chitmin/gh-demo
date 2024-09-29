import React from "react";

interface Props {
    users: User[]
  }

const UserList: React.FC<Props> = ({users}) => {
    return <div id="user-list">
        {users.length ? 
        <ul>
            {users.map((user) => <li key={user.id}>
                <img src={user.avatarUrl} alt={user.login} />
                <a href={user.url} target="_blank">{user.login}</a>
            </li>)}
        </ul> : ""}
    </div>
}

export default UserList;
