'use client';
import React from 'react';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to the Home Page</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-600 mb-4">Teste do botão com Flowbite:</p>
        <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
      </div>
    </div>
  );
}
