import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AxiosError } from "axios";
import { cn } from "../lib/utils";
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      };

      const { data } = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        config
      );
      
      console.log('Login successful:', data);

      // Save the token to localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        (error.response?.data as { message: string })?.message || 
        'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background text-foreground">
      {/* Back to home */}
      <Link to="/" className="fixed top-4 left-4 text-primary flex items-center gap-1">
        <ArrowLeft size={20} />
        Home
      </Link>
      
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Login to Your Account</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back! Enter your credentials to continue.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
            
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary underline underline-offset-2">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
