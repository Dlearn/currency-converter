import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import ACCESS_KEY from "../../constants/accessKey";
import countryOptions from "../../constants/countryOptions";

const last7Days = [];
for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  last7Days.push(d.toISOString().slice(0, 10));
}
const symbols = countryOptions.map(({ value }) => value).join(",");

export default function Chart({ country1, country2 }) {
  const [ratesByDate, setRatesByDate] = useState({});
  const [ready, setReady] = useState(false);

  const getHistoricalRate = useCallback(async (date) => {
    await fetch(
      `https://api.exchangeratesapi.io/v1/${date}?access_key=${ACCESS_KEY}&symbols=${symbols}`,
    )
      .then((resp) => resp.json())
      .then(({ rates }) => {
        setRatesByDate((prevRatesByDate) => ({
          ...prevRatesByDate,
          [date]: rates,
        }));
      });
  }, []);

  useEffect(() => {
    Promise.all(last7Days.map(getHistoricalRate)).then(() => {
      setReady(true);
      console.log("Successfully fetched for all!", { ratesByDate });
    });
  }, []);

  const getRate = (date, source, target) =>
    ratesByDate[date][target] / ratesByDate[date][source];

  if (!country1 || !country2 || !ready) {
    return null;
  }

  return (
    <Line
      data={{
        labels: last7Days,
        datasets: [
          {
            label: `${country1}-${country2}`,
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 2,
            data: last7Days.map((date) => getRate(date, country1, country2)),
          },
        ],
      }}
      interaction={{ mode: "nearest" }}
      options={{
        maintainAspectRatio: true,
        title: {
          display: true,
          fontSize: 24,
          text: `${country1}-${country2} over 7 days`,
        },
      }}
    />
  );
}
