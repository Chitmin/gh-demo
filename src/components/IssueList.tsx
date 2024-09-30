import { RepoContext } from "@/Contexts";
import { useCreateIssue, useRepository } from "@/lib/gql";
import {
  Loader,
  ArrowLeft,
  PlusIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionChunks } from "@/hooks/useCollectionChunks";
import { useToast } from "@/hooks/use-toast";

interface RepoWithOpenIssuesResult {
  repository: {
    id: string;
    issues: {
      nodes: Issue[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  };
}

const IssueList: React.FC<{
  owner: string;
  repo: Repo;
}> = ({ owner, repo }) => {
  const { toast } = useToast();
  const { loading, data, error, fetchMore } =
    useRepository<RepoWithOpenIssuesResult>(owner, repo.name);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [cursor, setCursor] = useState("");
  const [createIssue, { loading: issueLoading, error: issueError }] =
    useCreateIssue();

  const { setRepo } = useContext(RepoContext);

  const handleIssueCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createIssue({
      variables: { repositoryId: repo.id, title, body },
    });

    if (response.errors) {
      toast({
        description: response.errors[0].message,
      });
    } else {
      toast({
        description: "Issue created successfully",
      });
    }
  };

  const [page, dispatch] = useCollectionChunks<Issue>(repo.id);

  useEffect(() => {
    if (data?.repository?.issues?.pageInfo?.endCursor) {
      setCursor(data?.repository?.issues?.pageInfo?.endCursor);
    }
  }, [data]);

  useEffect(() => {
    if (page.key !== repo.id) {
      dispatch({ type: "reset", key: repo.id });
    } else {
      if (data?.repository?.issues?.nodes) {
        dispatch({
          type: "update",
          nextItems: data?.repository?.issues?.nodes,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, repo.id]);

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
          <header className="flex justify-between items-center mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setRepo(null);
              }}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold w-full text-left">Issues</h1>
            <Dialog>
              <DialogTrigger>
                <PlusIcon className="h-4 w-4 ml-2" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Issue</DialogTitle>
                </DialogHeader>
                {issueLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-top gap-4">
                        <Label htmlFor="name" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          className="col-span-3"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-top gap-4">
                        <Label htmlFor="username" className="text-right">
                          Body
                        </Label>
                        <Textarea
                          id="body"
                          className="col-span-3 min-h-32"
                          onChange={(e) => setBody(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleIssueCreate(e);
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </header>
          {issueError ? (
            <p className="text-red-500 text-sm pt-1">{issueError.message}</p>
          ) : (
            <>
              <div className="mb-4">
                <ul id="issues" className="flex flex-col divide-y">
                  {(page.chunks[page.current] || []).map((issue) => (
                    <li
                      key={issue.id}
                      className="flex flex-wrap justify-between p-2 mb-4"
                    >
                      {issue.title}
                    </li>
                  ))}
                </ul>
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
                  data?.repository?.issues?.pageInfo?.hasNextPage) && (
                  <Button
                    type="button"
                    size="icon"
                    className="mr-2"
                    variant="outline"
                    disabled={fetchLoading}
                    onClick={(e) => {
                      e.preventDefault();
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
                            fetchMoreResult?.data?.repository?.issues?.pageInfo
                              ?.endCursor || ""
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
          )}
        </div>
      )}
    </>
  );
};

export default IssueList;
