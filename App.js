import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import GetCountries from "./src/Components/GetCountries";

const errorLink = onError((graphqlErrors, networkError) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  //new HttpLink({ uri: "https://countries-274616.ew.r.appspot.com/" }),
  new HttpLink({ uri: "https://countries.trevorblades.com/" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StatusBar style="auto" />
      <GetCountries></GetCountries>
    </ApolloProvider>
  );
}
