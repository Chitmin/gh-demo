import { useState } from "react";
import { useSearchUsers } from '../lib/gql';
import UserList from "./UserList";

interface UserSearchResult {
    search: {
        nodes: User[]
    }
}

const SearchUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [searchUsers, { loading, error }] = useSearchUsers<UserSearchResult>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = (event.currentTarget.elements[0] as HTMLInputElement)?.value || "";

        if (username) {
            const response = await searchUsers({
                variables: { name: username },
            })

            setUsers(response.data?.search?.nodes || [])
        }
    };

    return <div>
        <form name="search-users" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search for users"
                name="user-name"
            />
            <button type='submit'>
                {loading ? "Loading..." : "Search"}
            </button>
            {error
                ? <p>{error.message}</p>
                : <UserList users={users} />
            }
        </form>
    </div>;
}

export default SearchUsers;
