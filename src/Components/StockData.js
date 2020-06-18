import React, { Component } from "react";

class StockData extends Component {
  render() {
    return (
      <div className="AddStocksTitle">
        <h5 className="add">Add stock to tracking</h5>
        <ul>
          {this.props.stockNames.map((item, index) => (
            <li key={index}>
              <button
                className="StockButton"
                onClick={() => {
                  this.props.clickEvent(item);
                }}
              >
                {item.symbol}
              </button>

              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default StockData;
