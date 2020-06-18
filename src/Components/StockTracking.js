import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";

class StockTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await firebase
      .database()
      .ref("TrackingStocks/")
      .on("value", (snapshot) => {
        if (snapshot && snapshot.exists()) {
          this.databaseData(snapshot.val());
          // this.setState({ tableData: snapshot.val() });
        }
      });
  };

  databaseData = (data) => {
    {
      this.props.trackingStockRemoveBtn(data);
    }
    this.setState({ tableData: data });
  };

  removeTrackingStock = (key) => {
    firebase
      .database()
      .ref(`/TrackingStocks/${key}`)
      .remove()
      .then(() => console.log("successfully Deleted"))
      .catch((error) => console.log("error"));
    console.log(this.state.tableData);
    if (Object.entries(this.state.tableData).length === 1) {
      this.setState({ tableData: 0 });
    }
  };

  render() {
    return (
      <div>
        <div className="head">
          <h2>Finance Porfolio Tracker</h2>
        </div>
        <div className="tableSection">
          <div className="MyStocks">
            <h4>
              <strong>My Stocks</strong>
            </h4>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="striped">
              <tr>
                <th>Stock Symbol</th>
                <th>Stock Name</th>
                <th>No. of Shares</th>
                <th>Buy Price</th>
                <th>Current Price</th>
                <th>
                  Profit/<br></br>Loss
                </th>
                <th>Stop Tracking</th>
              </tr>

              {Object.entries(this.state.tableData).map(([key, data]) => (
                <tr key={key}>
                  <td>{data.symbol}</td>
                  <td>{data.name}</td>
                  <td>{data.noOfShares}</td>
                  <td>{data.buyPrice}</td>
                  <td>{data.currentPrice}</td>
                  <td>
                    {(
                      (data.currentPrice - data.buyPrice) *
                      data.noOfShares
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="StopTrackingBtn waves-effect waves-light btn"
                      onClick={() => {
                        this.removeTrackingStock(key);
                        this.props.addstockButton(data);
                      }}
                    >
                      Stop Tracking
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default StockTracking;
