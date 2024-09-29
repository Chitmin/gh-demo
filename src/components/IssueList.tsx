import { RepoContext } from "@/Contexts";
import { useCreateIssue, useRepository } from "@/lib/gql";
import { Loader, StepBackIcon, PlusIcon } from "lucide-react";
import { useContext, useState } from "react";
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

interface RepoWithOpenIssuesResult {
  repository: {
    id: string;
    issues: {
      nodes: Issue[];
    };
  };
}

const IssueList: React.FC<{
  owner: string;
  repo: Repo;
}> = ({ owner, repo }) => {
  const { loading, data, error } = useRepository<RepoWithOpenIssuesResult>(
    owner,
    repo.name
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [createIssue, { loading: issueLoading, error: issueError }] =
    useCreateIssue();

  const { setRepo } = useContext(RepoContext);

  const handleIssueCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createIssue({ variables: { repositoryId: repo.id, title, body } });
  };

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
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Issues</h1>
            <div className="flex">
              <StepBackIcon
                className="h-4 w-4 ml-2"
                onClick={() => setRepo(null)}
              />

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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            className="col-span-3"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Body
                          </Label>
                          <Textarea
                            id="body"
                            className="col-span-3"
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
            </div>
          </header>
          {issueError ? (
            <p className="text-red-500 text-sm pt-1">{issueError.message}</p>
          ) : (
            <ul id="issues" className="flex flex-col">
              {data?.repository?.issues?.nodes?.map((issue) => (
                <li key={issue.id}>{issue.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default IssueList;
