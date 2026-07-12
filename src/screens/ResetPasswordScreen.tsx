import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export default function ResetPasswordScreen() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters');
      return;
    }
    setStatus('loading');
    try {
      const res = await apiClient.resetPassword(token, password);
      setStatus('success');
      setMessage(res.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return <div className="p-8 text-center">Invalid or missing reset token</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f0e6d3] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#2d2a26] mb-4 text-center">Reset Password</h2>
        {status === 'success' ? (
          <div className="text-green-600 text-center">
            <p className="mb-4">{message}</p>
            <a href="/login" className="text-[#d4a574] hover:underline">Go to Login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5c5c5c] mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#e8ddd0] rounded-lg focus:ring-2 focus:ring-[#d4a574]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c5c5c] mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-[#e8ddd0] rounded-lg focus:ring-2 focus:ring-[#d4a574]"
                required
              />
            </div>
            {status === 'error' && <p className="text-red-500 text-sm">{message}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#d4a574] text-white py-2 rounded-lg hover:bg-[#c49464] disabled:opacity-50"
            >
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
