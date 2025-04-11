import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  
  const login = (username: string, password: string) => {
    setIsLoggedIn(true);
    setCurrentUser({ id: 1, username, email: `${username}@example.com` });
    setCurrentPage(profileCompleted ? 'browse' : 'complete-profile');
  };
  
  const completeProfile = (profileData: any) => {
    setProfileCompleted(true);
    setCurrentUser({ ...currentUser, ...profileData });
    setCurrentPage('browse');
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };
  
  const Header = () => (
    <header className="app-header">
      <div className="logo">Web Matcha</div>
      {isLoggedIn && (
        <nav>
          <button onClick={() => setCurrentPage('browse')}>Browse</button>
          <button onClick={() => setCurrentPage('search')}>Search</button>
          <button onClick={() => setCurrentPage('chats')}>Chats</button>
          <button onClick={() => setCurrentPage('profile')}>Profile</button>
          <button 
            className={hasUnreadNotifications ? 'has-notifications' : ''}
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
          >
            Notifications
          </button>
          <button onClick={logout}>Logout</button>
        </nav>
      )}
    </header>
  );
  
  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return (
          <div className="auth-form">
            <h2>Login</h2>
            <button onClick={() => login('user', 'password')}>
              Mock Login (Skip Form)
            </button>
            <p onClick={() => setCurrentPage('register')}>Create an account</p>
          </div>
        );
      case 'register':
        return (
          <div className="auth-form">
            <h2>Register</h2>
            <button onClick={() => setCurrentPage('login')}>
              Back to Login
            </button>
          </div>
        );
      case 'complete-profile':
        return (
          <div className="profile-form">
            <h2>Complete Your Profile</h2>
            <button onClick={() => completeProfile({ 
              gender: 'Male',
              preference: 'Female',
              bio: 'Lorem ipsum',
              interests: ['#coding', '#travel']
            })}>
              Submit Profile
            </button>
          </div>
        );
      case 'browse':
        return (
          <div className="browse-page">
            <h2>Browse Matches</h2>
            <div className="profile-grid">
              {[1, 2, 3, 4, 5].map(id => (
                <div key={id} className="profile-card" 
                  onClick={() => setCurrentPage('view-profile')}>
                  Profile {id}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Page Not Found</div>;
    }
  };
  
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>Web Matcha © 2025</p>
      </footer>
    </div>
  );
};

export default App;
