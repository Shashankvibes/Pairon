import React, { useEffect, useRef } from 'react';
import { Tldraw, getSnapshot } from '@tldraw/tldraw';
import { useParams } from 'react-router-dom';
import '@tldraw/tldraw/tldraw.css';

const Whiteboard = ({ socketRef }) => {
  const editorRef = useRef(null);
  const { roomId } = useParams();

  const onMount = (editor) => {
    editorRef.current = editor;

    // Sync changes with socket
    editor.store.listen(
      () => {
        const snapshot = getSnapshot(editor.store);
        socketRef.current?.emit('WHITEBOARD_CHANGE', { roomId, snapshot });
      },
      { source: 'user', scope: 'document' }
    );
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    socket.emit('WHITEBOARD_JOIN', { roomId });

    const handleChange = ({ snapshot }) => {
      const editor = editorRef.current;
      if (editor && snapshot && Object.keys(snapshot).length > 0) {
        editor.store.loadSnapshot(snapshot);
      }
    };

    socket.on('WHITEBOARD_CHANGE', handleChange);
    return () => {
      socket.off('WHITEBOARD_CHANGE', handleChange);
    };
  }, [roomId]);

  return <Tldraw onMount={onMount} />;
};

export default Whiteboard;
