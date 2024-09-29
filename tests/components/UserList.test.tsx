import { render, screen, queryByAttribute } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import UserList from "../../src/components/UserList";

describe('User List component', () => {
  it('renders without error', () => {
    render(<UserList users={[]} />);
  });

  it('shows empty string for empty result', async () => {
    const dom = render(<UserList users={[]} />);

    const getById = queryByAttribute.bind(null, 'id');
    const div = getById(dom.container, 'user-list');
    expect(div).not.toBeNull();
    expect(div).toHaveTextContent('');
  });

  it('shows users', async () => {
    const user = {
      id: "abcd",
      login: "example",
      avatarUrl: "http://example.com",
      url: "http://example.com/example"
    };

    render(<UserList users={[user]} />);

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
