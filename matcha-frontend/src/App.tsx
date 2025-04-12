import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-secondary shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-primary text-2xl font-bold">Web Matcha</div>
        </div>
      </header>
      <main className="flex-grow p-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mb-4">
            Mock Login (Skip Form)
          </button>
          <p className="text-center text-blue-500 hover:text-blue-700 cursor-pointer">
            Create an account
          </p>
        </div>
      </main>
      <footer className="bg-secondary text-white py-4 px-6 text-center">
        <p>Web Matcha © 2025</p>
      </footer>
    </div>
  );
};

export default App;
