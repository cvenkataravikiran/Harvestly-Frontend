import React, { useState, useEffect } from 'react';
import { apiHelper } from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await apiHelper.get('/ping');
        if (response.success) {
          setStatus('✅ Backend connected successfully!');
        } else {
          setStatus('❌ Backend responded with error');
          setError(response.error);
        }
      } catch (err) {
        setStatus('❌ Backend connection failed');
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="alert alert-info" role="alert">
      <strong>API Connection Test:</strong> {status}
      {error && <div className="mt-2"><small className="text-danger">{error}</small></div>}
    </div>
  );
};

export default TestConnection; 