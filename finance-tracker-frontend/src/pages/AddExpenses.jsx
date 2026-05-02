import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { createExpense, deleteExpense, getErrorMessage, getExpenses, updateExpense } from '../api';

const AddExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    try {
      setExpenses(await getExpenses());
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load expenses'));
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const resetExpenseForm = () => {
    setCategory('');
    setAmount('');
    setDate('');
    setEditingExpenseId(null);
  };

  const saveExpense = async () => {
    if (!category || !amount || !date) {
      setError('Category, amount, and date are required');
      return;
    }

    try {
      setError('');
      const payload = {
        category,
        amount: Number(amount),
        date,
      };

      if (editingExpenseId) {
        await updateExpense(editingExpenseId, payload);
      } else {
        await createExpense(payload);
      }

      resetExpenseForm();
      await loadExpenses();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save expense'));
    }
  };

  const removeExpense = async (id) => {
    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete expense'));
    }
  };

  const startEditingExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setCategory(expense.category || '');
    setAmount(String(expense.amount ?? ''));
    setDate(expense.date || '');
    setError('');
  };

  return (
    <AppShell title="Expenses" subtitle="Create and remove expense entries backed by the API.">
      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel-grid">
        <article className="panel">
          <h3>{editingExpenseId ? 'Edit Expense' : 'New Expense'}</h3>
          <div className="form-grid">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Rent, groceries, transport"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button type="button" className="primary-button" onClick={saveExpense}>
              {editingExpenseId ? 'Update expense' : 'Save expense'}
            </button>
            {editingExpenseId ? (
              <button type="button" className="ghost-button" onClick={resetExpenseForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <h3>Saved Expenses</h3>
          <div className="item-list">
            {expenses.length === 0 ? <p className="empty-text">No expenses recorded yet.</p> : null}
            {expenses.map((expense) => (
              <div key={expense.id} className="list-row">
                <div>
                  <strong>{expense.category}</strong>
                  <span>{expense.date}</span>
                </div>
                <div className="row-actions">
                  <span>${Number(expense.amount || 0).toFixed(2)}</span>
                  <button type="button" className="ghost-button" onClick={() => startEditingExpense(expense)}>
                    Edit
                  </button>
                  <button type="button" className="ghost-button" onClick={() => removeExpense(expense.id)}>
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

export default AddExpenses;
