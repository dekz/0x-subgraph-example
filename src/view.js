import React, { Component } from 'react';
import ExchangeRateList from './list';

export default class ExchangeRateView extends Component {
    render() {
        return (
            <div style={{ padding: 20 }}>
                <h1>0x Fills</h1>
                <ExchangeRateList />
            </div>
        );
    }
}
