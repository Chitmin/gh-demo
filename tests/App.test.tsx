import { render } from '@testing-library/react'
import App from '../src/App'
import { describe, it } from 'vitest';
import { MockedProvider } from "@apollo/client/testing";

describe('App component', () => {
  it('renders without error', () => {
    render(
      <MockedProvider addTypename={false}>
        <App />
      </MockedProvider>
    )
  })
})
