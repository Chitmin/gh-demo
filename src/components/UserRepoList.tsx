import { useUserRepoList } from "@/lib/gql";
import { Loader, StepBackIcon, StepForwardIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { RepoContext } from "@/Contexts";
import { Button } from "@/components/ui/button";
import { useTransition, animated } from "@react-spring/web";
import { useCollectionChunks } from "@/hooks/useCollectionChunks";

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

  const [cursor, setCursor] = useState("");

  useEffect(() => {
    setCursor(data?.repositoryOwner?.repositories?.pageInfo?.endCursor || "");
  }, [data]);

  const [page, dispatch] = useCollectionChunks<Repo>(login);

  useEffect(() => {
    if (page.key !== login) {
      dispatch({ type: "reset", key: login });
    } else {
      if (data?.repositoryOwner?.repositories?.nodes) {
        dispatch({
          type: "update",
          nextItems: data?.repositoryOwner?.repositories?.nodes,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, login]);

  const transitions = useTransition(page, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
    config: { duration: 200 },
  });

  const [fetchLoading, setFetchLoading] = useState(false);
  const { setRepo } = useContext(RepoContext);

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
        <section>
          <h1 className="text-2xl font-bold mb-4">Repositories</h1>
          <>
            <div className="mb-4">
              {transitions((style, page) => {
                return (
                  <animated.ul
                    style={style}
                    className="flex flex-col flex-wrap justify-between divide-y"
                  >
                    {(page.chunks[page.current] || []).map((repo) => (
                      <li
                        key={repo.id}
                        className="flex flex-wrap justify-between hover:cursor-pointer hover:font-bold p-2 mb-4"
                        onClick={() => {
                          setRepo(repo);
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
                  </animated.ul>
                );
              })}
            </div>
            <div className="mb-4">
              {page.current > 1 && (
                <Button
                  type="button"
                  size="icon"
                  className="mr-2"
                  variant="outline"
                  onClick={() => dispatch({ type: "prev" })}
                >
                  <StepBackIcon />
                </Button>
              )}

              {(page.current < page.length ||
                data?.repositoryOwner?.repositories?.pageInfo?.hasNextPage) && (
                <Button
                  type="button"
                  size="icon"
                  className="mr-2"
                  variant="outline"
                  disabled={fetchLoading}
                  onClick={() => {
                    if (page.current + 1 in page.chunks) {
                      dispatch({ type: "next" });
                    } else {
                      setFetchLoading(true);
                      fetchMore({
                        variables: {
                          after: cursor,
                        },
                        updateQuery(_, { fetchMoreResult }) {
                          return fetchMoreResult;
                        },
                      }).then((fetchMoreResult) => {
                        setCursor(
                          fetchMoreResult?.data?.repositoryOwner?.repositories
                            ?.pageInfo?.endCursor || ""
                        );

                        setFetchLoading(false);
                      });
                    }
                  }}
                >
                  {fetchLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <StepForwardIcon />
                  )}
                </Button>
              )}
            </div>
          </>
        </section>
      )}
    </>
  );
};

export default UserRepolist;
