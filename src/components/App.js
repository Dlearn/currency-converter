import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Segment,
} from "semantic-ui-react";

import countryOptions from "../constants/countryOptions";
import Converter from "./Converter";

const APP_KEY = "77e4c8d314772d486c5ea441dd615808";

export default function App() {
  const [rates, setRates] = useState({});
  const [timestamp, setTimestamp] = useState(0);
  const [country1, setCountry1] = useState("USD");
  const [country2, setCountry2] = useState("EUR");

  useEffect(() => {
    const symbols = countryOptions.map(({ value }) => value).join(",");
    // fetch(
    //   `http://api.exchangeratesapi.io/v1/latest?access_key=${APP_KEY}&symbols=${symbols}`,
    // )
    //   .then((resp) => resp.json())
    //   .then(({ rates: data, success, timestamp: timestampRes }) => {
    //     if (success) {
    //       setRates(data);
    //       setTimestamp(timestampRes);
    //     }
    //   });
    setRates({
      EUR: 1,
      USD: 1.218125,
      GBP: 0.860835,
      CAD: 1.469778,
      AUD: 1.575433,
      SGD: 1.621562,
    });
    setTimestamp(new Date(1621689724 * 1000));
  }, []);

  return (
    <Container>
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
    </Container>
  );
}
