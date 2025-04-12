import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import recipeLogo from '../assets/img/recipe.jpg';

const Login = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Getting user info from Google using the access token
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        // Storing user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          access_token: tokenResponse.access_token
        }));

        // Redirecting to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing login:', error);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src={recipeLogo}
            alt="Recipe Portal Logo"
            className="w-32 h-32 object-cover rounded-full shadow-lg mb-4"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Recipe Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your personal culinary companion
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => login()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 