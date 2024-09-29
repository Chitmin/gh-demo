import { render } from '@testing-library/react'
import { describe, it } from 'vitest';
import { MockedProvider } from "@apollo/client/testing";
import SearchUsers from "../../src/components/SearchUsers";
import { searchUsers as SEARCH_USERS } from "../../src/lib/gql";

const mocks = [
    {
      request: {
        query: SEARCH_USERS,
        variables: {
          name: "Example"
        }
      },
      result: {
        data: {
          dog: { id: "1", loin: "Example", avatarUrl: "https://example.com", url: "bulldog" }
        }
      }
    }
  ];

describe('SearchUsers component', () => {
  it('renders without error', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SearchUsers />
      </MockedProvider>
    )
  })
})
