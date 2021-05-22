import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Form, Grid, Input } from "semantic-ui-react";

import countryOptions from "../../constants/countryOptions";

import "./styles.css";

const exchangeLossOptions = [
  { key: "0", value: "0", text: "0%" },
  { key: "1", value: "1", text: "1%" },
  { key: "2", value: "2", text: "2% (Typical ATM rate)" },
  { key: "3", value: "3", text: "3% (Typical Credit Card rate)" },
  { key: "4", value: "4", text: "4%" },
  { key: "5", value: "5", text: "5% (Typical Kiosk rate)" },
];

export default function Converter({
  country1,
  country2,
  rates,
  setCountry1,
  setCountry2,
  timestamp,
}) {
  const [exchangeLoss, setExchangeLoss] = useState("0");
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);

  useEffect(() => {
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
    <>
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
    </>
  );
}
