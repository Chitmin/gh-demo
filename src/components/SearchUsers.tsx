import { useContext } from "react";
import { useSearchUsers } from '../lib/gql';
import { UserContext } from "../Contexts";

interface UserSearchResult {
    search: {
        nodes: User[]
    }
}

const SearchUsers = () => {
    const context = useContext(UserContext);
    const [searchUsers, { loading, error }] = useSearchUsers<UserSearchResult>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = (event.currentTarget.elements[0] as HTMLInputElement)?.value || "";

        if (username) {
            const response = await searchUsers({
                variables: { name: username },
            })

            context.update(response.data?.search?.nodes || [])
        }
    };

    return <div className="w-full">
        <form
            className="flex"
            name="search-users"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="Search for users"
                name="user-name"
            />
            <button type='submit'>
                {loading ? "Loading..." : "Search"}
            </button>
            {error ? <p>{error.message}</p> : ""}
        </form>
    </div>;
}

export default SearchUsers;
