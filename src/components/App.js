import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Input,
  Segment,
} from "semantic-ui-react";

const useDebouncedEffect = (effect, delay, deps) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};

const APP_KEY = "77e4c8d314772d486c5ea441dd615808";
const countryOptions = [
  { key: "USD", value: "USD", flag: "us", text: "United States Dollar" },
  { key: "EUR", value: "EUR", flag: "eu", text: "Euro" },
  { key: "SGD", value: "SGD", flag: "sg", text: "Singapore Dollar" },
];

export default function App() {
  const [rates, setRates] = useState({});
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [country1, setCountry1] = useState("USD");
  const [country2, setCountry2] = useState("EUR");

  useEffect(() => {
    const symbols = countryOptions.map(({ value }) => value).join(",");
    fetch(
      `http://api.exchangeratesapi.io/v1/latest?access_key=${APP_KEY}&symbols=${symbols}`,
    )
      .then((resp) => resp.json())
      .then(({ rates: data, success }) => {
        if (success) {
          setRates(data);
          console.log({ data });
        }
      });
  }, []);

  const convertCurrency = useEffect(() => {
    if (Object.keys(rates).length > 0) {
      const convertedAmount =
        (Number(amount1) * rates[country2]) / rates[country1];
      setAmount2(convertedAmount);
    }
  }, [amount1, country1, country2, rates]);

  const debouncedSetAmount1 = useCallback(
    debounce((nextAmount) => {
      setAmount1(Number(nextAmount).toFixed(2));
    }, 500),
    [],
  );

  return (
    <div>
      <Segment placeholder>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>
            <Button
              circular
              icon="exchange"
              onClick={() => {
                const tmpA1 = Number(amount1);
                const tmpA2 = Number(amount2);
                setAmount1(tmpA2.toFixed(2));
                setAmount2(tmpA1.toFixed(2));

                const tmpC1 = country1;
                const tmpC2 = country2;
                setCountry1(tmpC2);
                setCountry2(tmpC1);
              }}
            />
          </Divider>

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
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
              <Input
                className="hide-arrows"
                onChange={(e) => {
                  setAmount1(e.target.value);
                  debouncedSetAmount1(e.target.value);
                }}
                type="number"
                value={amount1}
              />
            </Grid.Column>

            <Grid.Column>
              <Dropdown
                fluid
                onChange={(e, { value }) => setCountry2(value)}
                placeholder="Select Country"
                search
                selection
                options={countryOptions}
                value={country2}
              />
              <p>{Number(amount2).toFixed(2)}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
}
