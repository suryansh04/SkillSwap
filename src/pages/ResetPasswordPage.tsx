import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import axios from 'axios';

const ResetPasswordPage = () => {
  // Get the token from URL params
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validToken, setValidToken] = useState(!!token);

  const { password, confirmPassword } = formData;

  // Handle token extraction and validation
  useEffect(() => {
    console.log('Reset token from route:', token);
    
    // If no token in route, check query params
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromQuery = urlParams.get('token');
      
      console.log('Token from query params:', tokenFromQuery);
      
      if (tokenFromQuery) {
        // If token is in query params but not in route, update the URL
        console.log('Redirecting to clean URL with token in path');
        navigate(`/reset-password/${tokenFromQuery}`, { replace: true });
      } else {
        setError('Invalid or missing reset token. Please use the link from your email.');
        setValidToken(false);
      }
    } else {
      setValidToken(true);
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      return setError('Invalid or missing reset token. Please use the link from your email.');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending reset request with token:', token);
      console.log('Request payload:', { password: '*****' }); // Don't log actual password
      
      const response = await axios.put(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        }
      );

      console.log('Reset password response status:', response.status);
      console.log('Response data:', response.data);

      if (!response.data || response.data.success === false) {
        const errorMessage = response.data?.message || 'Failed to reset password';
        console.error('Reset password failed:', errorMessage);
        setError(errorMessage);
        return;
      }

      setSuccess('Password has been reset successfully! Redirecting to login...');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Error resetting password. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background text-foreground">
      {/* Back to home */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="fixed top-4 left-4 flex items-center gap-1"
      >
        <ArrowLeft size={20} />
        Home
      </Button>
      
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground text-sm">
            Please enter your new password below.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        ) : !success && validToken && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter new password"
                  value={password}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className={loading ? 'opacity-70' : ''}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required 
                  disabled={loading}
                  className={loading ? 'opacity-70' : ''}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full",
                loading && "opacity-70 cursor-not-allowed"
              )}
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        )}
        {!validToken && !success && (
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Invalid or expired reset link.'}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/forgot-password')}
              className="mt-4"
            >
              Request New Reset Link
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
