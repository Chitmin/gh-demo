import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  type DefaultOptions,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GITHUB_ENDPOINT,
  headers: {
    authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

const noCacheOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: import.meta.env.DEV ? noCacheOptions : {},
});

export default client;
