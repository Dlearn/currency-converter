import React, { useEffect, useState } from "react";
import { Grid, Segment } from "semantic-ui-react";

import ACCESS_KEY from "../constants/accessKey";
import countryOptions from "../constants/countryOptions";
import Converter from "./Converter";
import Chart from "./Chart";

export default function App() {
  const [rates, setRates] = useState({});
  const [timestamp, setTimestamp] = useState(0);
  const [country1, setCountry1] = useState("USD");
  const [country2, setCountry2] = useState("EUR");

  useEffect(() => {
    const symbols = countryOptions.map(({ value }) => value).join(",");
    fetch(
      `http://api.exchangeratesapi.io/v1/latest?access_key=${ACCESS_KEY}&symbols=${symbols}`,
    )
      .then((resp) => resp.json())
      .then(({ rates: data, success, timestamp: timestampRes }) => {
        if (success) {
          setRates(data);
          setTimestamp(new Date(timestampRes * 1000));
        }
      });
  }, []);

  return (
    <>
      <Segment>
        <Grid stackable>
          <Converter
            country1={country1}
            country2={country2}
            rates={rates}
            setCountry1={setCountry1}
            setCountry2={setCountry2}
            timestamp={timestamp}
          />
        </Grid>
      </Segment>
      <Chart country1={country1} country2={country2} />
    </>
  );
}
