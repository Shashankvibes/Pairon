import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/theme/monokai.css';

/* 🔥 Language Modes (Popular) */
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';     // C, C++, Java, C#
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/php/php';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/go/go';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/shell/shell';

/* 🔥 Features */
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

/* Autocomplete */
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/html-hint';

/* Search & Replace */
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog';

import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, language = "javascript", theme = "dracula" }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            if (editorRef.current) {
                editorRef.current.toTextArea();
            }

            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: languageMode(language),
                    theme: theme,
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",   // Autocomplete
                        "Ctrl-F": "findPersistent"      // Search & Replace
                    }
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }

        init();
    }, [language, theme]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (code !== null && code !== editorRef.current.getValue()) {
                editorRef.current.setValue(code);
            }
        });

        return () => {
            socket.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
};

/* ✅ Language Mapper */
function languageMode(lang) {
    switch (lang) {
        case "python": return "python";
        case "java": return "text/x-java";
        case "cpp": return "text/x-c++src";
        case "c": return "text/x-csrc";
        case "csharp": return "text/x-csharp";
        case "html": return "htmlmixed";
        case "css": return "css";
        case "sql": return "sql";
        case "markdown": return "markdown";
        case "php": return "php";
        case "ruby": return "ruby";
        case "go": return "go";
        case "swift": return "swift";
        case "perl": return "perl";
        case "bash": return "shell";
        case "json": return { name: "javascript", json: true };
        default: return "javascript";
    }
}

export default Editor;
