import { gql, useLazyQuery, useQuery } from "@apollo/client";

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
