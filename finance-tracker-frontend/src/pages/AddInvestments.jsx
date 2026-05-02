import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { createInvestment, deleteInvestment, getErrorMessage, getInvestments, updateInvestment } from '../api';

const AddInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [editingInvestmentId, setEditingInvestmentId] = useState(null);
  const [error, setError] = useState('');

  const loadInvestments = async () => {
    try {
      setInvestments(await getInvestments());
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load investments'));
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const resetInvestmentForm = () => {
    setType('');
    setAmount('');
    setDate('');
    setExpectedReturn('');
    setEditingInvestmentId(null);
  };

  const saveInvestment = async () => {
    if (!type || !amount || !date || !expectedReturn) {
      setError('Type, amount, date, and expected return are required');
      return;
    }

    try {
      setError('');
      const payload = {
        type,
        amount: Number(amount),
        date,
        expectedReturn: Number(expectedReturn),
      };

      if (editingInvestmentId) {
        await updateInvestment(editingInvestmentId, payload);
      } else {
        await createInvestment(payload);
      }

      resetInvestmentForm();
      await loadInvestments();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save investment'));
    }
  };

  const removeInvestment = async (id) => {
    try {
      await deleteInvestment(id);
      await loadInvestments();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete investment'));
    }
  };

  const startEditingInvestment = (investment) => {
    setEditingInvestmentId(investment.id);
    setType(investment.type || '');
    setAmount(String(investment.amount ?? ''));
    setDate(investment.date || '');
    setExpectedReturn(String(investment.expectedReturn ?? ''));
    setError('');
  };

  return (
    <AppShell title="Investments" subtitle="Track investment entries with backend persistence.">
      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel-grid">
        <article className="panel">
          <h3>{editingInvestmentId ? 'Edit Investment' : 'New Investment'}</h3>
          <div className="form-grid">
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Stocks, bonds, mutual funds"
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
            <input
              type="number"
              min="0"
              step="0.01"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="Expected return"
            />
            <button type="button" className="primary-button" onClick={saveInvestment}>
              {editingInvestmentId ? 'Update investment' : 'Save investment'}
            </button>
            {editingInvestmentId ? (
              <button type="button" className="ghost-button" onClick={resetInvestmentForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <h3>Saved Investments</h3>
          <div className="item-list">
            {investments.length === 0 ? <p className="empty-text">No investments recorded yet.</p> : null}
            {investments.map((investment) => (
              <div key={investment.id} className="list-row">
                <div>
                  <strong>{investment.type}</strong>
                  <span>{investment.date}</span>
                </div>
                <div className="row-actions row-actions-wide">
                  <span>${Number(investment.amount || 0).toFixed(2)}</span>
                  <span>Return ${Number(investment.expectedReturn || 0).toFixed(2)}</span>
                  <button type="button" className="ghost-button" onClick={() => startEditingInvestment(investment)}>
                    Edit
                  </button>
                  <button type="button" className="ghost-button" onClick={() => removeInvestment(investment.id)}>
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

export default AddInvestments;
