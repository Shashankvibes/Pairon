import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import Whiteboard from '../components/Whiteboard';
import RightNavbar from '../components/Navbar';
import ChatBox from '../components/Chatbox';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import '../App.css';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [dragDisabled, setDragDisabled] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // 🔥 New states
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dracula");

  const whiteboardRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }

        setClients(
          clients.filter(
            (client, index, self) =>
              index === self.findIndex((c) => c.socketId === client.socketId)
          )
        );

        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  };

  const leaveRoom = () => reactNavigator('/');

  const handleRun = () => console.log('Run button clicked');
  const handleWhiteboard = () => setShowWhiteboard((prev) => !prev);
  const handleChat = () => setShowChat((prev) => !prev);
  const handleSave = () => console.log('Save button clicked');

  const handleRightClick = (e) => {
    e.preventDefault();
    setDragDisabled((prev) => !prev);
  };

  const handleMouseDown = (e) => {
    if (dragDisabled || e.button === 2) return;

    const target = whiteboardRef.current;
    if (!target) return;

    // Only drag if clicked on header bar
    if (!e.target.classList.contains('whiteboard-header')) return;

    const offsetX = e.clientX - target.getBoundingClientRect().left;
    const offsetY = e.clientY - target.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      target.style.left = `${pageX - offsetX}px`;
      target.style.top = `${pageY - offsetY}px`;
    };

    const onMouseMove = (event) => moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
    const stopDragging = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopDragging);
    };
    document.addEventListener('mouseup', stopDragging);
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap" style={{ position: 'relative' }}>
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/final1.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

       {/* 🔥 Dropdowns for Language + Theme */}
<div style={{ marginTop: '15px' }}>
  <label className="dropdown-label">Select Language:</label>
  <select className="custom-dropdown" value={language} onChange={(e) => setLanguage(e.target.value)}>
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="java">Java</option>
    <option value="cpp">C++</option>
    <option value="c">C</option>
    <option value="csharp">C#</option>
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="sql">SQL</option>
    <option value="markdown">Markdown</option>
    <option value="php">PHP</option>
    <option value="ruby">Ruby</option>
    <option value="go">Go</option>
    <option value="swift">Swift</option>
    <option value="perl">Perl</option>
    <option value="bash">Bash</option>
    <option value="json">JSON</option>
  </select>
</div>

<div style={{ marginTop: '15px' }}>
  <label className="dropdown-label">Select Theme:</label>
  <select className="custom-dropdown" value={theme} onChange={(e) => setTheme(e.target.value)}>
    <option value="dracula">Dracula</option>
    <option value="material">Material</option>
    <option value="oceanic-next">Oceanic Next</option>
    <option value="monokai">Monokai</option>
  </select>
</div>


        <button id="btncopy" className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button id="btnleave" className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          language={language}
          theme={theme}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>

      {showWhiteboard && (
        <div
          ref={whiteboardRef}
          onContextMenu={handleRightClick}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            width: '80%',
            height: '80%',
            background: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            zIndex: 100,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            resize: 'both',
            overflow: 'hidden',
          }}
        >
          {/* Header bar for dragging and close button */}
          <div
            className="whiteboard-header"
            style={{
              width: '100%',
              background: '#444',
              color: 'white',
              padding: '5px 10px',
              cursor: dragDisabled ? 'default' : 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Whiteboard</span>
            <button
              onClick={() => setShowWhiteboard(false)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ❌ Close
            </button>
          </div>
          <div style={{ width: '100%', height: 'calc(100% - 35px)' }}>
            <Whiteboard socketRef={socketRef} />
          </div>
        </div>
      )}

      {showChat && (
        <ChatBox
          socketRef={socketRef}
          roomId={roomId}
          username={location.state?.username}
          onClose={() => setShowChat(false)}
        />
      )}

      <RightNavbar
        onRun={handleRun}
        onWhiteboard={handleWhiteboard}
        onChat={handleChat}
        onSave={handleSave}
      />
    </div>
  );
};

export default EditorPage;
