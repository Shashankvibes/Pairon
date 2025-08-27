// components/Navbar.jsx
import React, { useState } from 'react';
import {
  Play,
  LayoutDashboard,     // better for whiteboard
  MessageCircle,
  Save,
  UserCircle              // better for profile
} from 'lucide-react';
import '../App.css';

const Navbar = ({ onRun, onWhiteboard, onChat, onSave }) => {
  const [active, setActive] = useState('');

  const handleClick = (action, name) => {
    setActive(name);
    action();
  };

  return (
    <div className="right-navbar">
      <button
        className={`nav-btn ${active === 'run' ? 'active' : ''}`}
        onClick={() => handleClick(onRun, 'run')}
        title="Run Code"
      >
        <Play size={22} />
      </button>

      <button
        className={`nav-btn ${active === 'whiteboard' ? 'active' : ''}`}
        onClick={() => handleClick(onWhiteboard, 'whiteboard')}
        title="Whiteboard"
      >
        <LayoutDashboard size={22} />
      </button>

      <button
        className={`nav-btn ${active === 'chat' ? 'active' : ''}`}
        onClick={() => handleClick(onChat, 'chat')}
        title="Chat"
      >
        <MessageCircle size={22} />
      </button>

      <button
        className={`nav-btn ${active === 'save' ? 'active' : ''}`}
        onClick={() => handleClick(onSave, 'save')}
        title="Save"
      >
        <Save size={22} />
      </button>

      <div className="user-icon" title="Profile">
        <UserCircle size={22} />
      </div>
    </div>
  );
};

export default Navbar;
