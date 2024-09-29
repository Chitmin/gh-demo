import { render, screen, queryByAttribute } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import UserList from "../../src/components/UserList";
import { UserContext } from "../../src/Contexts";

describe('User List component', () => {
  it('renders without error', () => {
    render(
      <UserContext.Provider value={{ users: [], update: () => {} }}>
        <UserList />
      </UserContext.Provider>
    );
  });

  it('shows empty string for empty result', async () => {
    const dom = render(
      <UserContext.Provider value={{ users: [], update: () => {} }}>
        <UserList />
      </UserContext.Provider>
    );

    const getById = queryByAttribute.bind(null, 'id');
    const section = getById(dom.container, 'user-list');
    expect(section).not.toBeNull();
    
    const ul = getById(dom.container, 'users');
    expect(ul).toBeNull();
  });

  it('shows users', async () => {
    const user = {
      id: "abcd",
      login: "example",
      avatarUrl: "http://example.com",
      url: "http://example.com/example"
    };

    render(
      <UserContext.Provider value={{ users: [user], update: () => {} }}>
        <UserList />
      </UserContext.Provider>
  );

    const img = await screen.findByRole('img');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('src', 'http://example.com');
    expect(img).toHaveAttribute('alt', 'example');

    const a = await screen.findByRole('link');
    expect(a).not.toBeNull();
    expect(a).toHaveAttribute('href', 'http://example.com/example');
    expect(a).toHaveTextContent('example');
  });
})
