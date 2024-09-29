interface User {
  id: string;
  login: string;
  avatarUrl: string;
  url: string;
  __typename: string;
}

interface Repo {
  id: string;
  name: string;
  stargazerCount: number;
  watchers: {
    totalCount: number;
  };
}

interface Issue {
  id: string;
  title: string;
}

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}
