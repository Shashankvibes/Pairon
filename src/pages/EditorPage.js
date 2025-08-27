import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import Whiteboard from '../components/Whiteboard';
import RightNavbar from '../components/Navbar';
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
  const handleChat = () => console.log('Chat button clicked');
  const handleSave = () => console.log('Save button clicked');

  const handleRightClick = (e) => {
    e.preventDefault();
    setDragDisabled((prev) => !prev);
  };

  const handleMouseDown = (e) => {
    if (dragDisabled || e.button === 2) return;

    const target = whiteboardRef.current;
    const offsetX = e.clientX - target.getBoundingClientRect().left;
    const offsetY = e.clientY - target.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      target.style.left = `${pageX - offsetX}px`;
      target.style.top = `${pageY - offsetY}px`;
    };

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);
    };

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
            padding: '10px',
            resize: 'both',
            overflow: 'auto',
            cursor: dragDisabled ? 'default' : 'move',
          }}
        >
          <button
            onClick={() => setShowWhiteboard(false)}
            style={{
              float: 'right',
              marginBottom: '10px',
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
          <Whiteboard socketRef={socketRef} />
        </div>
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
