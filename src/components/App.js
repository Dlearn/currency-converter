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

import "./styles.css";

const styleTargetInput = {
  opacity: "1",
};

const useDebouncedEffect = (effect, delay, deps) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};

const APP_KEY = "77e4c8d314772d486c5ea441dd615808";
const countryOptions = [
  { key: "EUR", value: "EUR", flag: "eu", text: "Euro" },
  { key: "USD", value: "USD", flag: "us", text: "United States Dollar" },
  { key: "GBP", value: "GBP", flag: "gb", text: "British Pound" },
  { key: "CAD", value: "CAD", flag: "ca", text: "Canadian Dollar" },
  { key: "AUD", value: "AUD", flag: "au", text: "Australian Dollar" },
  { key: "SGD", value: "SGD", flag: "sg", text: "Singapore Dollar" },
];

const exchangeLossOptions = [
  { key: "0", value: "0", text: "0%" },
  { key: "1", value: "1", text: "1%" },
  { key: "2", value: "2", text: "2% (Typical ATM rate)" },
  { key: "3", value: "3", text: "3% (Typical Credit Card rate)" },
  { key: "4", value: "4", text: "4%" },
  { key: "5", value: "5", text: "5% (Typical Kiosk rate)" },
];

export default function App() {
  const [exchangeLoss, setExchangeLoss] = useState("0");
  const [rates, setRates] = useState({});
  const [timestamp, setTimestamp] = useState(0);
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
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

  const convertCurrency = useEffect(() => {
    if (Object.keys(rates).length > 0) {
      const exchangeLossFactor = (100 - exchangeLoss) / 100;
      const conversionFactor = rates[country2] / rates[country1];
      const convertedAmount =
        Number(amount1) * conversionFactor * exchangeLossFactor;
      setAmount2(convertedAmount);
    }
  }, [amount1, country1, country2, exchangeLoss, rates]);

  const debouncedSetAmount1 = useCallback(
    debounce((nextAmount) => {
      setAmount1(Number(nextAmount).toFixed(2));
    }, 500),
    [],
  );

  return (
    <Container>
      <Segment>
        <Grid stackable>
          <Grid.Column width={7}>
            <Form>
              <Form.Field>
                <label>Currency I Have</label>
                <Dropdown
                  fluid
                  onChange={(e, { value }) => {
                    setCountry1(value);
                  }}
                  placeholder="Select Country"
                  search
                  selection
                  options={countryOptions}
                  value={country1}
                />
              </Form.Field>
              <Form.Field>
                <label>Amount I Have</label>
                <Input
                  fluid
                  onChange={(e) => {
                    setAmount1(e.target.value);
                    debouncedSetAmount1(e.target.value);
                  }}
                  type="number"
                  value={amount1}
                />
              </Form.Field>
            </Form>
          </Grid.Column>

          <Grid.Column verticalAlign="middle" width={2}>
            <Button
              circular
              className="flipButton"
              icon="exchange"
              onClick={() => {
                const tmpC1 = country1;
                const tmpC2 = country2;
                setCountry1(tmpC2);
                setCountry2(tmpC1);
              }}
            />
          </Grid.Column>

          <Grid.Column width={7}>
            <Form>
              <Form.Field>
                <label>Currency I Want</label>
                <Dropdown
                  fluid
                  onChange={(e, { value }) => setCountry2(value)}
                  placeholder="Select Country"
                  search
                  selection
                  options={countryOptions}
                  value={country2}
                />
              </Form.Field>
              <Form.Field>
                <label>Amount I Want</label>
                <Input
                  className="destinationInput"
                  disabled
                  onChange={(e) => {
                    setAmount1(e.target.value);
                    debouncedSetAmount1(e.target.value);
                  }}
                  type="number"
                  value={Number(amount2).toFixed(2)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>Exchange Loss:</label>
                  <Dropdown
                    onChange={(e, { value }) => setExchangeLoss(value)}
                    selection
                    options={exchangeLossOptions}
                    value={exchangeLoss}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <label>Accurate as of:</label>
              <b>{`${timestamp.toString()}`}</b>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
}
