import { useUserRepoList } from "@/lib/gql";
import { memo } from "react";
import { Loader, StepBackIcon, StepForwardIcon } from "lucide-react";
import { useContext, useEffect, useReducer, useState } from "react";
import { RepoContext } from "@/Contexts";
import { Button } from "@/components/ui/button";
import { useTransition, animated } from "@react-spring/web";

interface UserRepoResult {
  repositoryOwner: {
    repositories: {
      nodes: Repo[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  };
}

interface PageChunks {
  chunks: Record<number, Repo[]>;
  current: number;
  found: boolean;
  length: number;
}

interface Action {
  type: "next" | "prev" | "update";
  nextItems?: Repo[];
}

function pageReducer(page: PageChunks, action: Action) {
  const { type } = action;

  switch (type) {
    case "next":
      if (page.current + 1 in page.chunks) {
        return {
          chunks: { ...page.chunks },
          current: page.current + 1,
          found: true,
          length: Object.keys(page.chunks).length,
        };
      } else {
        return {
          chunks: { ...page.chunks },
          current: page.current,
          found: false,
          length: Object.keys(page.chunks).length,
        };
      }
    case "prev":
      if (page.current === 1) {
        return {
          chunks: { ...page.chunks },
          current: page.current,
          found: page.found,
          length: Object.keys(page.chunks).length,
        };
      }

      return {
        chunks: { ...page.chunks },
        current: page.current - 1,
        found: page.current - 1 in page.chunks,
        length: Object.keys(page.chunks).length,
      };
    case "update":
      if (page.current + 1 in page.chunks) {
        return {
          chunks: { ...page.chunks },
          current: page.current + 1,
          found: true,
          length: Object.keys(page.chunks).length,
        };
      }

      return {
        chunks: action?.nextItems
          ? {
              ...page.chunks,
              [page.current + 1]: action?.nextItems,
            }
          : { ...page.chunks },
        current: page.current + 1,
        found: true,
        length: Object.keys(page.chunks).length,
      };
    default:
      return page;
  }
}

const repoCount = 10;

const UserRepolist: React.FC<{
  login: string;
}> = memo(({ login }) => {
  const { loading, data, error, fetchMore } = useUserRepoList<UserRepoResult>(
    login,
    repoCount,
    ""
  );

  const [cursor, setCursor] = useState("");

  useEffect(() => {
    setCursor(data?.repositoryOwner?.repositories?.pageInfo?.endCursor || "");
  }, [data]);

  const [page, dispatch] = useReducer(pageReducer, {
    chunks: {},
    current: 0,
    found: false,
    length: 0,
  });

  useEffect(() => {
    if (data?.repositoryOwner?.repositories?.nodes) {
      dispatch({
        type: "update",
        nextItems: data?.repositoryOwner?.repositories?.nodes,
      });
    }
  }, [data]);

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
                    className="flex flex-col flex-wrap justify-between"
                  >
                    {(page.chunks[page.current] || []).map((repo) => (
                      <li
                        key={repo.id}
                        className="flex flex-wrap justify-between hover:cursor-pointer hover:shadow p-2 mb-4"
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
                    <StepForwardIcon onClick={() => setRepo(null)} />
                  )}
                </Button>
              )}
            </div>
          </>
        </section>
      )}
    </>
  );
});

export default UserRepolist;
