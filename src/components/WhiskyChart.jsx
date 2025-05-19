import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function WhiskyChart({ history }) {
  const dates = Object.keys(history).sort();
  const sources = {};

  dates.forEach(date => {
    history[date].prices.forEach(({ source, price }) => {
      if (!sources[source]) sources[source] = [];
      sources[source].push(price);
    });
  });

  const datasets = Object.entries(sources).map(([source, prices]) => ({
    label: source,
    data: prices,
    borderWidth: 2,
    tension: 0.2
  }));

  return <Line data={{ labels: dates, datasets }} />;
}
