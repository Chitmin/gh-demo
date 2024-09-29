import { useUserRepoList } from "@/lib/gql";
// import { memo } from "react";
import { Loader } from "lucide-react";
import Pager from "./Pager";
import { useState } from "react";

interface UserRepoResult {
  repositoryOwner: {
    repositories: {
      nodes: Repo[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  };
}

const repoCount = 10;

const UserRepolist: React.FC<{
  login: string;
}> = ({ login }) => {
  const { loading, data, error, fetchMore } = useUserRepoList<UserRepoResult>(
    login,
    repoCount,
    ""
  );

  const [fetchLoading, setFetchLoading] = useState(false);

  if (error) {
    return <p className="text-red-500 text-sm pt-1">{error.message}</p>;
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Repositories</h1>
          {fetchLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <ul id="repos" className="flex flex-col flex-wrap justify-between">
              {data?.repositoryOwner?.repositories?.nodes?.map((repo) => (
                <li
                  key={repo.id}
                  className="flex flex-wrap justify-between hover:cursor-pointer hover:shadow-sm p-2 mb-4"
                  onClick={() => {
                    //
                  }}
                >
                  <div>{repo.name}</div>
                  <div className="italic text-sm">
                    <span>{repo.stargazerCount} stars</span>
                    <span className="mx-2"> / </span>
                    <span>{repo.watchers.totalCount} watching</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {data && (
            <Pager
              fetcher={({
                setPageCursors,
                setCursor,
                currentPage,
                after,
                itemsPerPage,
              }): void => {
                setFetchLoading(true);
                fetchMore({
                  variables: {
                    first: itemsPerPage,
                    after,
                  },

                  updateQuery: (_, { fetchMoreResult }) => {
                    return fetchMoreResult;
                  },
                }).then((fetchMoreResult) => {
                  // @ts-expect-error react set queue function type mismatch
                  setPageCursors(function (prev: Record<number, string>) {
                    if (currentPage in prev) {
                      return prev;
                    } else {
                      return {
                        [currentPage]:
                          fetchMoreResult.data.repositoryOwner.repositories
                            .pageInfo.endCursor,
                        ...prev,
                      };
                    }
                  });

                  setCursor(
                    fetchMoreResult.data.repositoryOwner.repositories.pageInfo
                      .endCursor || ""
                  );

                  setFetchLoading(false);
                });
              }}
              total={data.repositoryOwner.repositories.totalCount}
              pageInfo={data.repositoryOwner.repositories.pageInfo}
              itemsPerPage={repoCount}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UserRepolist;
