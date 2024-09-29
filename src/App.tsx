import { ApolloProvider } from "@apollo/client";
import client from "./lib/client";
import "./App.css"

export default function App() {
  return <ApolloProvider client={client}>
    <h1 className="text-3xl font-bold">Search</h1>
    </ApolloProvider>
}
