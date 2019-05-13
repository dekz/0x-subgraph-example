import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { fontSize, colors } from './styles';

const FILLS_QUERY_INTERNAL = `
  createdAt
  makerAssetFilledAmount
  takerAssetFilledAmount
  taker
  order {
      id
      maker
  }
  transactionHash
  id
`;
const FILL_SUBSCRIPTION = gql`
    subscription fills {
      fills(orderBy: createdAt, orderDirection: desc) {
        ${FILLS_QUERY_INTERNAL}
      }
    }
`;

const FILL_QUERY = gql`
    {
      fills(orderBy: createdAt, orderDirection: desc, first: 15) {
        ${FILLS_QUERY_INTERNAL}
      }
    }
`;

const FillsListView = class extends React.PureComponent {
    componentDidMount() {
        this.props.subscribeToMore();
    }
    render() {
        const { data } = this.props;
        return (
            <div style={{ width: '100%', padding: 30 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Tx hash</th>
                            <th>createdAt</th>
                            <th>maker</th>
                            <th>taker</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.fills
                            .slice(0, 15)
                            .map(
                                ({
                                    createdAt,
                                    transactionHash,
                                    id,
                                    makerAssetFilledAmount,
                                    takerAssetFilledAmount,
                                    taker,
                                    order,
                                }) => (
                                    <tr key={id}>
                                        <td>
                                            <a href={`https://etherscan.io/tx/${transactionHash}`}>
                                                {transactionHash.substr(0, 16)}...
                                            </a>
                                        </td>
                                        <td>{createdAt}</td>
                                        <td>{order.maker}</td>
                                        <td>{taker}</td>
                                    </tr>
                                ),
                            )}
                    </tbody>
                </table>
            </div>
        );
    }
};
export default () => (
    <Query query={FILL_QUERY}>
        {({ loading, error, data, subscribeToMore }) => {
            if (loading) return null;
            if (error) return <p>{`Error: ${error}`}</p>;
            const more = () =>
                subscribeToMore({
                    document: FILL_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        return subscriptionData.data;
                    },
                });
            return <FillsListView data={data} subscribeToMore={more} />;
        }}
    </Query>
);
