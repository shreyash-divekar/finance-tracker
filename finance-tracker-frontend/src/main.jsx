import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import IndexPage from './pages/IndexPage';
import AddExpenses from './pages/AddExpenses';
import AddInvestments from './pages/AddInvestments';
import TrackInvestments from './pages/TrackInvestments';
import TrackExpenses from './pages/TrackExpenses';
import FinanceInsights from './pages/FinanceInsights';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><IndexPage /></ProtectedRoute>} />
      <Route path="/add-expenses" element={<ProtectedRoute><AddExpenses /></ProtectedRoute>} />
      <Route path="/add-investments" element={<ProtectedRoute><AddInvestments /></ProtectedRoute>} />
      <Route path="/track-investments" element={<ProtectedRoute><TrackInvestments /></ProtectedRoute>} />
      <Route path="/track-expenses" element={<ProtectedRoute><TrackExpenses /></ProtectedRoute>} />
      <Route path="/finance-insights" element={<ProtectedRoute><FinanceInsights /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
