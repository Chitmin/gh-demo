import { useContext } from "react";
import { useSearchUsers } from '../lib/gql';
import { UserContext } from "../Contexts";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"


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

    return <div className="w-full p-4 mb-8">
        <form
            className="flex flex-wrap justify-center"
            name="search-users"
            onSubmit={handleSubmit}
        >
            <Input
                type="text"
                placeholder="Search for users"
                name="username"
                className="flex-initial max-w-md mx-2"
            />
            <Button
                type='submit'
                size={loading ? "icon" : "default"}
                className="flex-initial min-w-32 mx-2"
            >
                {
                    loading
                        ? <Loader className="h-4 w-4 animate-spin" />
                        : "Search"
                }
            </Button>
            {error ? <p className="text-red-500 text-sm pt-1">{error.message}</p> : ""}
        </form>
    </div>;
}

export default SearchUsers;
