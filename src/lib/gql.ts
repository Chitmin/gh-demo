import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

export const searchUsers = gql`
  query searchUsers($name: String!) {
    search(query: $name, type: USER, first: 5) {
      nodes {
        ... on User {
          id
          login
          avatarUrl
          url
          __typename
        }
      }
    }
  }
`;

export function useSearchUsers<T>() {
  return useLazyQuery<T>(searchUsers);
}

export const userRepoList = gql`
  query userRepoList($login: String!, $count: Int!, $after: String) {
    repositoryOwner(login: $login) {
      repositories(first: $count, after: $after) {
        nodes {
          id
          name
          stargazerCount
          watchers {
            totalCount
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

export function useUserRepoList<T>(
  login: string,
  count: number,
  after: string = ""
) {
  return useQuery<T>(userRepoList, { variables: { login, count, after } });
}

export const repository = gql`
  query getRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      issues(first: 100, filterBy: { states: OPEN }) {
        nodes {
          id
          title
        }
      }
    }
  }
`;

export function useRepository<T>(owner: string, name: string) {
  return useQuery<T>(repository, { variables: { owner, name } });
}

export const createIssue = gql`
  mutation createIssue($repositoryId: ID!, $title: String!, $body: String!) {
    createIssue(
      input: { repositoryId: $repositoryId, title: $title, body: $body }
    ) {
      issue {
        id
        number
        title
        body
        url
      }
    }
  }
`;

export function useCreateIssue() {
  return useMutation(createIssue);
}
