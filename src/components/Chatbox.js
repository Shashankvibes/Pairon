import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const ChatBox = ({ socketRef, roomId, username, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeouts = useRef({});

  // Listen for incoming chat messages
  useEffect(() => {
    if (!socketRef?.current) return;

    const handleIncoming = (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'chat' }]);
    };

    const handleSystemMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        { message: data.message, type: 'system', timestamp: data.timestamp },
      ]);
    };

    const handleTyping = ({ username: u, isTyping }) => {
      if (u === username) return; // don’t show for self
      setTypingUsers((prev) => ({ ...prev, [u]: isTyping }));

      // auto-clear after 3s
      if (isTyping) {
        clearTimeout(typingTimeouts.current[u]);
        typingTimeouts.current[u] = setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [u]: false }));
        }, 3000);
      }
    };

    socketRef.current.on('CHAT_MESSAGE', handleIncoming);
    socketRef.current.on('SYSTEM_MESSAGE', handleSystemMessage);
    socketRef.current.on('TYPING', handleTyping);

    return () => {
      socketRef.current.off('CHAT_MESSAGE', handleIncoming);
      socketRef.current.off('SYSTEM_MESSAGE', handleSystemMessage);
      socketRef.current.off('TYPING', handleTyping);
    };
  }, [socketRef, username]);

  // autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef?.current) return;
    if (newMessage.trim() === '') return;

    socketRef.current.emit('CHAT_MESSAGE', {
      roomId,
      message: newMessage.trim(),
    });

    setNewMessage('');
    socketRef.current.emit('TYPING', { roomId, username, isTyping: false });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socketRef?.current) return;

    socketRef.current.emit('TYPING', { roomId, username, isTyping: true });
  };

  return (
    <div className="chatbox" role="dialog" aria-label="Room chat">
      <div className="chatbox-header">
        <span>💬 Room Chat</span>
        <button type="button" onClick={onClose}>❌</button>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg, i) =>
          msg.type === 'system' ? (
            <div key={i} className="chat-system">
              <em>🔔 {msg.message} ({msg.timestamp})</em>
            </div>
          ) : (
            <div
              key={i}
              className={`chat-message ${msg.username === username ? 'self' : 'other'}`}
            >
              <div className="chat-meta">
                <strong>{msg.username}</strong>
                <span className="chat-time">{msg.timestamp}</span>
              </div>
              <div className="chat-text">{msg.message}</div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* typing indicator */}
      <div className="chat-typing">
        {Object.entries(typingUsers)
          .filter(([, isTyping]) => isTyping)
          .map(([u]) => (
            <span key={u}>{u} is typing...</span>
          ))}
      </div>

      <div className="chatbox-input">
        <textarea
          rows={1}
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button type="button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
