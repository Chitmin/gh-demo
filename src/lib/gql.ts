import { gql, useLazyQuery } from "@apollo/client";

export const searchUsers = gql`
  query searchUsers($name: String!) {
    search(query: $name, type: USER, first: 5) {
      nodes {
        ... on User {
          id
          login
          avatarUrl
          url
        }
      }
    }
  }
`;

export function useSearchUsers<T>() {
  return useLazyQuery<T>(searchUsers);
}
