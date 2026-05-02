import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AppShell from '../components/AppShell';
import { getInvestments } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrackInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        setInvestments(await getInvestments());
      } catch (err) {
        setError(err.response?.data || 'Unable to load investment chart');
      }
    };

    loadInvestments();
  }, []);

  const totalsByType = investments.reduce((accumulator, investment) => {
    const key = investment.type || 'Unknown';
    accumulator[key] = (accumulator[key] || 0) + Number(investment.amount || 0);
    return accumulator;
  }, {});

  const data = {
    labels: Object.keys(totalsByType),
    datasets: [
      {
        data: Object.values(totalsByType),
        backgroundColor: ['#4d908e', '#577590', '#f9844a', '#f94144', '#90be6d', '#f9c74f'],
      },
    ],
  };

  return (
    <AppShell title="Investment Chart" subtitle="Allocation by investment type using API data.">
      {error ? <p className="error-text">{error}</p> : null}
      <section className="panel">
        {investments.length === 0 ? (
          <p className="empty-text">Add investments first to populate the chart.</p>
        ) : (
          <div className="chart-wrap">
            <Pie data={data} />
          </div>
        )}
      </section>
    </AppShell>
  );
};

export default TrackInvestments;
