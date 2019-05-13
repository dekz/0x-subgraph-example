import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { colors } from './styles';
import FillsView from './view';

const wsLink = new WebSocketLink({
    uri: `wss://api.thegraph.com/subgraphs/name/dekz/zeroex`,
    options: {
        reconnect: true,
    },
});
const httpLink = new HttpLink({
    uri: `https://api.thegraph.com/subgraphs/name/dekz/zeroex`,
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const App = () => (
    <ApolloProvider client={client}>
        <div id="root" style={{ backgroundColor: colors.white }}>
            <FillsView />
        </div>
    </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
