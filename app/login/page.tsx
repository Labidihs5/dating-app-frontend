'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [showAppleModal, setShowAppleModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50" />
      
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-64 h-64 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 rounded-full blur-3xl opacity-60" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 border-4 border-white shadow-2xl overflow-hidden">
                <img src="/placeholder-user.jpg" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-8 left-12 w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden border-2 border-white">
                <img src="/placeholder-user.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-16 right-8 w-10 h-10 rounded-full bg-white shadow-lg overflow-hidden border-2 border-white">
                <img src="/placeholder-user.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-12 left-8 w-14 h-14 rounded-full bg-white shadow-lg overflow-hidden border-2 border-white">
                <img src="/placeholder-user.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-16 right-12 w-11 h-11 rounded-full bg-white shadow-lg overflow-hidden border-2 border-white">
                <img src="/placeholder-user.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Let's meet new<br />people around you</h1>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/profile')}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 rounded-xl shadow-md border border-gray-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <Button 
            onClick={() => router.push('/profile')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </Button>

          <Button 
            onClick={() => setShowAppleModal(true)}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-md flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Use mobile number
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <button onClick={() => router.push('/profile')} className="text-purple-600 font-semibold">Sign Up</button>
        </p>
      </div>

      {showAppleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative">
            <button onClick={() => setShowAppleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                M
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Apple ID</h2>
              <p className="text-sm text-gray-600">Do you want to sign in to Meet Dating App-<br />Meet People with your Apple ID<br />"user@icloud.com"?</p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-gray-500">Face ID</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowAppleModal(false)} variant="outline" className="flex-1 h-11 rounded-xl">
                Cancel
              </Button>
              <Button onClick={() => router.push('/profile')} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
