import React, { Component } from "react";
import Axios from "axios";
import firebase from "firebase/app";
import "firebase/database";
class FetchApi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.apiQuery,
      stockValue: {},
    };
  }

  componentDidMount() {
    // if (this.state.query !== " ") {
    Axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.query}&apikey=289IDFVBTBBRIPUN`
    )
      .then((res) => {
        const data = res.data;
        const result = data["Time Series (Daily)"];
        const entries = Object.entries(result)[0];
        this.setState({ stockValue: entries[1]["4. close"] });
        this.setPrice();
        console.log(this.state.stockValue);
      })
      .catch((err) => alert("Failed fetching Api"));
    // }
  }

  setPrice = async () => {
    firebase
      .database()
      .ref("TrackingStocks/" + this.props.id)
      .set({
        currentPrice: this.state.stockValue,
      });
    console.log(this.state.stockValue);
  };
  render() {
    return <div></div>;
  }
}

export default FetchApi;
