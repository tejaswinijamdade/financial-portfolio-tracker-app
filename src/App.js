import React from "react";
import "./App.css";
import Axios from "axios";
import { FaTimesCircle } from "react-icons/fa";
import StockData from "./Components/StockData";
import StockTracking from "./Components/StockTracking";
import Modal from "react-modal";
import FetchApi from "./Components/FetchApi";
import { firebaseConfig } from "./Firebase/FirebaseConfig";
import firebase from "firebase/app";
import "firebase/database";
firebase.initializeApp(firebaseConfig);
Modal.setAppElement("#root");
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trackingStocks: [],
      stocks: [
        { symbol: "MSFT", name: "Microsoft Corporation", id: 0 },
        { symbol: "DIS", name: "Walt Disney Co ", id: 1 },
        { symbol: "BA", name: "Boeing Co", id: 2 },
        { symbol: "HD", name: "Home Depot Inc", id: 3 },
        { symbol: "NKE", name: "NIKE INC", id: 4 },
        { symbol: "MCD", name: "Mcdonald's Corp", id: 5 },
        { symbol: "INTC", name: "Intel Corporation", id: 6 },
        { symbol: "GS", name: "Goldman Sachs Group Inc", id: 7 },
        { symbol: "JPM", name: "JPMorgan Chase & Co.", id: 8 },
        { symbol: "AXP", name: "American Express Company", id: 9 },
        { symbol: "IBM", name: "IBM Common Stock", id: 10 },
      ],
      isModalOpen: false,

      stockSymbol: " ",
      stockName: " ",
      NoOfShares: " ",
      buyPrice: " ",
      currentPrice: "",
      profitLoss: " ",
      buyDate: {},
      stockID: {},
    };
  }

  addToTrackStock = (addStock) => {
    console.log(addStock);
    this.state.trackingStocks.push(addStock.id);
    this.setState({
      stocks: this.state.stocks.filter((stock) => stock.symbol !== addStock),
    });
  };

  removeBtn = (data) => {
    console.log(data);
    Object.entries(data).map(([key, removeStock]) => {
      this.setState({
        stocks: this.state.stocks.filter(
          (stock) => stock.symbol !== removeStock.symbol
        ),
      });
    });
  };

  fAddStockButton = (data) => {
    console.log(data);
    if (data.buyPrice) {
      this.state.stocks.push({
        symbol: data.symbol,
        name: data.name,
        id: data.stockID,
      });
    }
    this.setState({ stocks: this.state.stocks });
  };

  handleCLick = (item) => {
    this.setState({ stockSymbol: item.symbol });
    this.setState({ stockName: item.name });
    this.setState({ stockID: item.id });
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  handleModal = () => {
    if (
      Object.keys(this.state.buyPrice).length === 0 ||
      Object.keys(this.state.NoOfShares).length === 0 ||
      Object.keys(this.state.buyDate).length === 0
    ) {
      alert("Please enter values");
    } else {
      this.setState({ isModalOpen: !this.state.isModalOpen });
      this.setDatabase();
      this.addToTrackStock(this.state.stockSymbol);
    }
  };

  setDatabase = async () => {
    try {
      firebase
        .database()
        .ref("TrackingStocks/" + this.state.stockID)
        .update({
          symbol: this.state.stockSymbol,
          name: this.state.stockName,
          noOfShares: this.state.NoOfShares,
          buyPrice: this.state.buyPrice,
          stockId: this.state.stockID,
        });
    } catch (err) {
      console.log(err);
    }
  };
  handleCloseModal = () => this.setState({ isModalOpen: false });

  render() {
    return (
      <div>
        <StockTracking
          addstockButton={this.fAddStockButton}
          trackingStockRemoveBtn={this.removeBtn}
        ></StockTracking>

        <StockData
          stockNames={this.state.stocks}
          clickEvent={this.handleCLick}
        ></StockData>

        <Modal
          isOpen={this.state.isModalOpen}
          // onRequestClose={() => this.handleCloseModal}
        >
          <FaTimesCircle
            size={30}
            style={{ float: "right" }}
            onClick={this.handleCloseModal}
          ></FaTimesCircle>
          <div className="AddStockForm">
            <h2 className="formHead">{`Add ${this.state.stockName} to my stocks`}</h2>

            <section className="formContainer">
              <div className="formEle">
                <h5>Company Name</h5>
                <span style={{ position: "relative", right: "0px" }}>
                  {this.state.stockName}
                </span>
              </div>
              <div className="formEle">
                <h5>No. of Shares</h5>
                <input
                  type="number"
                  id="noShares"
                  placeholder="No. of shares"
                  onChange={(e) => {
                    this.setState({ NoOfShares: e.target.value });
                  }}
                />
              </div>
              <div className="formEle">
                <h5>Buy Price</h5>
                <input
                  type="number"
                  id="buyPrice"
                  placeholder="Buy Price"
                  onChange={(e) => {
                    this.setState({ buyPrice: e.target.value });
                  }}
                />
              </div>
              <div className="formEle">
                <h5>Buy Date</h5>

                <input
                  type="date"
                  id="buyDate"
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => {
                    this.setState({ buyDate: e.target.value });
                  }}
                />
              </div>
              <div className=" btn">
                <button className="AddButton" onClick={this.handleModal}>
                  Add
                </button>
                <FetchApi
                  apiQuery={this.state.stockSymbol}
                  id={this.state.stockID}
                ></FetchApi>
              </div>
            </section>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
