import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { getExpenses, getIncomes, getInvestments } from '../api';

const FinanceInsights = () => {
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    investments: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTotals = async () => {
      try {
        const [incomeData, expenseData, investmentData] = await Promise.all([
          getIncomes(),
          getExpenses(),
          getInvestments(),
        ]);

        setTotals({
          income: incomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
          expenses: expenseData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
          investments: investmentData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
        });
      } catch (err) {
        setError(err.response?.data || 'Unable to load finance insights');
      }
    };

    loadTotals();
  }, []);

  const savings = totals.income - totals.expenses - totals.investments;
  const savingsRate = totals.income > 0 ? (savings / totals.income) * 100 : 0;

  return (
    <AppShell title="Insights" subtitle="Computed from your current backend totals.">
      {error ? <p className="error-text">{error}</p> : null}

      <section className="stats-grid">
        <article className="stat-panel">
          <span>Total Income</span>
          <strong>${totals.income.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Total Expenses</span>
          <strong>${totals.expenses.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Total Investments</span>
          <strong>${totals.investments.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Savings Rate</span>
          <strong>{savingsRate.toFixed(1)}%</strong>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <h3>Current Read</h3>
          <p className="insight-copy">
            Savings after expenses and investments: <strong>${savings.toFixed(2)}</strong>
          </p>
          <p className="insight-copy">
            {savings > 0
              ? 'Your current setup is running positive. You have room either to save more or deploy extra capital deliberately.'
              : 'You are spending and investing beyond current income. Bring expenses down or grow income before adding more fixed outflow.'}
          </p>
        </article>
        <article className="panel">
          <h3>Quick Ratios</h3>
          <p className="insight-copy">Expense load: {totals.income > 0 ? ((totals.expenses / totals.income) * 100).toFixed(1) : '0.0'}%</p>
          <p className="insight-copy">Investment load: {totals.income > 0 ? ((totals.investments / totals.income) * 100).toFixed(1) : '0.0'}%</p>
          <p className="insight-copy">Unallocated cash: ${Math.max(savings, 0).toFixed(2)}</p>
        </article>
      </section>
    </AppShell>
  );
};

export default FinanceInsights;
