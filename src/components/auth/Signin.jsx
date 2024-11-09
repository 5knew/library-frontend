import React, { useState } from 'react';
import { authService } from '../../Services/authService';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.signIn(email, password);
      
      // Store tokens
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('email', response.userInfo.email);

      // Store user info and ID if available in the response
      if (response.userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
        // Optionally store the user ID separately if needed
        localStorage.setItem('userId', response.userInfo.id);
      }

      // Redirect to home or another page
      navigate('/');

    } catch (error) {
      console.error("Sign in failed", error);
      // Handle sign-in failure (e.g., show error message to user)
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-lg">
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-800">
        Sign in to your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          To begin reading books for AUPET University
        </a>
      </p>
    </div>
    
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" value="true" />
      
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-t-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-b-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default SignIn;
