import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { createIncome, deleteIncome, getErrorMessage, getExpenses, getIncomes, getInvestments, updateIncome } from '../api';

const IndexPage = () => {
  const [incomeSources, setIncomeSources] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [newIncome, setNewIncome] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const [incomeData, expenseData, investmentData] = await Promise.all([
        getIncomes(),
        getExpenses(),
        getInvestments(),
      ]);

      setIncomeSources(incomeData);
      setExpenses(expenseData);
      setInvestments(investmentData);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load dashboard data'));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const resetIncomeForm = () => {
    setNewIncome('');
    setNewAmount('');
    setNewDate('');
    setEditingIncomeId(null);
  };

  const saveIncome = async () => {
    if (!newIncome || !newAmount || !newDate) {
      setError('Source, amount, and date are required');
      return;
    }

    try {
      setError('');
      const payload = {
        source: newIncome,
        amount: Number(newAmount),
        date: newDate,
      };

      if (editingIncomeId) {
        await updateIncome(editingIncomeId, payload);
      } else {
        await createIncome(payload);
      }

      resetIncomeForm();
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save income'));
    }
  };

  const removeIncome = async (id) => {
    try {
      await deleteIncome(id);
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete income'));
    }
  };

  const startEditingIncome = (income) => {
    setEditingIncomeId(income.id);
    setNewIncome(income.source || '');
    setNewAmount(String(income.amount ?? ''));
    setNewDate(income.date || '');
    setError('');
  };

  const totalIncome = incomeSources.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalInvestments = investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = totalIncome - totalExpenses - totalInvestments;

  return (
    <AppShell title="Dashboard" subtitle="Live totals from the backend, plus quick income entry.">
      {error ? <p className="error-text">{error}</p> : null}

      <section className="stats-grid">
        <article className="stat-panel">
          <span>Total Income</span>
          <strong>${totalIncome.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Total Expenses</span>
          <strong>${totalExpenses.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Total Investments</span>
          <strong>${totalInvestments.toFixed(2)}</strong>
        </article>
        <article className="stat-panel">
          <span>Remaining Balance</span>
          <strong>${balance.toFixed(2)}</strong>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <h3>{editingIncomeId ? 'Edit Income' : 'Add Income'}</h3>
          <div className="form-grid">
            <input
              type="text"
              value={newIncome}
              onChange={(e) => setNewIncome(e.target.value)}
              placeholder="Salary, freelance, dividends"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Amount"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <button type="button" className="primary-button" onClick={saveIncome}>
              {editingIncomeId ? 'Update income' : 'Save income'}
            </button>
            {editingIncomeId ? (
              <button type="button" className="ghost-button" onClick={resetIncomeForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <h3>Income Entries</h3>
          <div className="item-list">
            {incomeSources.length === 0 ? <p className="empty-text">No income recorded yet.</p> : null}
            {incomeSources.map((income) => (
              <div key={income.id} className="list-row">
                <div>
                  <strong>{income.source}</strong>
                  <span>{income.date}</span>
                </div>
                <div className="row-actions">
                  <span>${Number(income.amount || 0).toFixed(2)}</span>
                  <button type="button" className="ghost-button" onClick={() => startEditingIncome(income)}>
                    Edit
                  </button>
                  <button type="button" className="ghost-button" onClick={() => removeIncome(income.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
};

export default IndexPage;
