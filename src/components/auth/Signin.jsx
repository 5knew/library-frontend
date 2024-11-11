import React, { useState } from 'react';
import { authService } from '../../Services/authService';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">Sign in to your account</CardTitle>
        <CardDescription className="text-center">
          Or{' '}
          <a href="#" className="text-primary hover:underline">
            To begin reading books for AUPET University
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
)
}

export default SignIn;
