import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  LayoutDashboard,
  MessageCircle,
  Save,
  UserCircle,
  Timer
} from 'lucide-react';
import Draggable from 'react-draggable';
import '../App.css';

const Navbar = ({ onRun, onWhiteboard, onChat, onSave }) => {
  const [active, setActive] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const handleClick = (action, name) => {
    setActive(name);
    if (typeof action === 'function') {
      action();
    }
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Convert seconds to mm:ss format
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <>
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

        <button
          className={`nav-btn ${active === 'timer' ? 'active' : ''}`}
          onClick={() => handleClick(toggleTimer, 'timer')}
          title="Timer"
        >
          <Timer size={22} />
        </button>

        <div className="user-icon" title="Profile">
          <UserCircle size={22} />
        </div>
      </div>

      {/* Timer Dialog */}
      {showTimer && (
        <Draggable nodeRef={timerRef} handle=".timer-header">
          <div className="timer-box" ref={timerRef}>
            <div className="timer-header">
              <span>Timer</span>
              <button className="close-btn" onClick={toggleTimer}>×</button>
            </div>
            <div className="timer-body">
              <h3>{formatTime(time)}</h3>
              <div className="timer-buttons">
                <button onClick={startTimer}>Start</button>
                <button onClick={pauseTimer}>Pause</button>
                <button onClick={resetTimer}>Reset</button>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default Navbar;
