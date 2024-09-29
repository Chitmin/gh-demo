import React from "react";

interface Props {
    users: User[]
  }

const UserList: React.FC<Props> = ({users}) => {
    return users.length ? <div>
        <ul>
            {users.map((user) => <li key={user.id}>
                <img src={user.avatarUrl} alt={user.login} />
                <a href={user.url} target="_blank">{user.login}</a>
            </li>)}
        </ul>
    </div> : <p data-testid="no-users">"No users found"</p>
}

export default UserList;
