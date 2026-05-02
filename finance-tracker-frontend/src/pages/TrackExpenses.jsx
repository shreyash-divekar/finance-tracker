import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import AppShell from '../components/AppShell';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getExpenses } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrackExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setExpenses(await getExpenses());
      } catch (err) {
        setError(err.response?.data || 'Unable to load expense chart');
      }
    };

    loadExpenses();
  }, []);

  const totalsByCategory = expenses.reduce((accumulator, expense) => {
    const key = expense.category || 'Uncategorized';
    accumulator[key] = (accumulator[key] || 0) + Number(expense.amount || 0);
    return accumulator;
  }, {});

  const data = {
    labels: Object.keys(totalsByCategory),
    datasets: [
      {
        data: Object.values(totalsByCategory),
        backgroundColor: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#8ab17d'],
      },
    ],
  };

  return (
    <AppShell title="Expense Chart" subtitle="Breakdown by category from saved backend records.">
      {error ? <p className="error-text">{error}</p> : null}
      <section className="panel">
        {expenses.length === 0 ? (
          <p className="empty-text">Add expenses first to populate the chart.</p>
        ) : (
          <div className="chart-wrap">
            <Pie data={data} />
          </div>
        )}
      </section>
    </AppShell>
  );
};

export default TrackExpenses;
