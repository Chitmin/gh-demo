import { render, queryByAttribute } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserList from "../../src/components/UserList";
import { UserContext } from "../../src/Contexts";

const defaultContextValue = {
  users: [],
  setUsers: () => {},
  selectUser: null,
  setSelectUser: () => {},
};

describe("User List component", () => {
  it("renders without error", () => {
    render(
      <UserContext.Provider value={defaultContextValue}>
        <UserList />
      </UserContext.Provider>
    );
  });

  it("shows empty string for empty result", async () => {
    const dom = render(
      <UserContext.Provider value={defaultContextValue}>
        <UserList />
      </UserContext.Provider>
    );

    const getById = queryByAttribute.bind(null, "id");
    const section = getById(dom.container, "user-list");
    expect(section).not.toBeNull();

    const ul = getById(dom.container, "users");
    expect(ul).toBeNull();
  });

  it("shows users", async () => {
    const user = {
      id: "abcd",
      login: "example",
      avatarUrl: "http://example.com",
      url: "http://example.com/example",
      __typename: "User",
    };

    const dom = render(
      <UserContext.Provider value={{ ...defaultContextValue, users: [user] }}>
        <UserList />
      </UserContext.Provider>
    );

    const a = await dom.container.querySelector(
      "#users > li > span:last-child"
    );
    expect(a).not.toBeNull();
    expect(a).toHaveTextContent("example");
  });
});
