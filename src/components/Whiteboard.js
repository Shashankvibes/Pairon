import React, { useEffect, useRef } from 'react';
import { Tldraw, getSnapshot } from '@tldraw/tldraw';
import { useParams } from 'react-router-dom';
import '@tldraw/tldraw/tldraw.css';

const Whiteboard = ({ socketRef }) => {
  const editorRef = useRef(null);
  const { roomId } = useParams();

  const onMount = (editor) => {
    editorRef.current = editor;

    // Only emit if editor + snapshot is valid
    editor.store.listen(
      () => {
        try {
          const snapshot = getSnapshot(editor.store);
          if (snapshot && Object.keys(snapshot).length > 0) {
            socketRef.current?.emit('WHITEBOARD_CHANGE', { roomId, snapshot });
          }
        } catch (err) {
          console.error('❌ Error creating snapshot:', err);
        }
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
      if (!editor || !snapshot) return;

      try {
        // Prevent empty / corrupted snapshots from breaking editor
        if (Object.keys(snapshot).length > 0) {
          editor.store.loadSnapshot(snapshot);
        }
      } catch (err) {
        console.error('❌ Failed to load snapshot:', err);
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
