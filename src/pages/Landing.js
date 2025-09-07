import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import MonacoEditor from "@monaco-editor/react";
import {
  Home,
  Gem,
  Code,
  MessageSquare,
  Clipboard,
  LifeBuoy,
  Headphones,
  Play,
  Cpu,
  Phone,
  Database,
  X,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SAMPLE_CODE = `// Welcome to Pairon — live preview
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Pairon'));
`;

export default function Landing() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  // Modals
  const [showPremium, setShowPremium] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // Support form state (prefill email with the one you gave)
  const YOUR_EMAIL = "shashankchaturvedi320@gmail.com";
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState(YOUR_EMAIL);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function runCode() {
    setRunning(true);
    setTimeout(() => {
      setOutput("Hello User, welcome to Pairon");
      setRunning(false);
    }, 500);
  }

  const openPremium = () => setShowPremium(true);
  const closePremium = () => setShowPremium(false);

  const openHelp = () => setShowHelp(true);
  const closeHelp = () => setShowHelp(false);

  const openSupport = () => setShowSupport(true);
  const closeSupport = () => setShowSupport(false);

  const closeAll = () => {
    setShowPremium(false);
    setShowHelp(false);
    setShowSupport(false);
  };

  // Single effect to handle ESC key and body scroll locking for any modal open
  useEffect(() => {
    const anyOpen = showPremium || showHelp || showSupport;
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    if (anyOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showPremium, showHelp, showSupport]);

  const stopPropagation = (e) => e.stopPropagation();

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) {
      toast.error("Please fill name, email and message.");
      return;
    }

    // Placeholder action — replace with real API call
    const payload = {
      name: supportName,
      email: supportEmail,
      subject: supportSubject,
      message: supportMessage,
      time: new Date().toISOString(),
    };
    console.log("Support request payload:", payload);
    toast.success("Support request sent. We'll get back to you at " + supportEmail);
    // reset or keep values as required
    setSupportSubject("");
    setSupportMessage("");
    // close modal
    closeSupport();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">P</div>
            <div className="leading-tight">
              <div className="font-extrabold">Pairon</div>
              <div className="text-xs text-slate-400">Collaborative Code Editor</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="ml-2 rounded-full px-4 py-2 bg-slate-800/30 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Home
            </button>

            <button
              onClick={openPremium}
              className="ml-2 rounded-full px-4 py-2 bg-slate-800/30 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Gem className="w-4 h-4" /> Premium
            </button>

            <button
              onClick={openHelp}
              className="ml-2 rounded-full px-4 py-2 bg-slate-800/30 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <LifeBuoy className="w-4 h-4" /> Help
            </button>

            <button
              onClick={openSupport}
              className="ml-2 rounded-full px-4 py-2 bg-slate-800/30 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Headphones className="w-4 h-4" /> Support
            </button>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <header id = "header-landing" className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left hero */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Collaborative{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-400">
              Code Editing
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Pairon is a real-time collaborative code editor with live execution, integrated chat,
            a shared whiteboard and multi-language support — built for seamless teamwork.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="rounded-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md text-white"
            >
              Get Started
            </button>

            <button
              onClick={openPremium}
              className="rounded-full px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <Gem className="w-4 h-4" /> Get Premium
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-5 shadow-lg text-center">
              <Code className="mx-auto mb-2" />
              <div className="font-semibold">Real-time Sync</div>
              <div className="text-xs text-slate-200/80 mt-1">Collaborate on code with instant merges</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl p-5 shadow-lg text-center">
              <MessageSquare className="mx-auto mb-2" />
              <div className="font-semibold">Integrated Chat</div>
              <div className="text-xs text-slate-200/80 mt-1">Contextual chat beside your editor</div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-5 shadow-lg text-center">
              <Clipboard className="mx-auto mb-2" />
              <div className="font-semibold">Whiteboard</div>
              <div className="text-xs text-slate-200/80 mt-1">Draw diagrams together in real-time</div>
            </div>
          </div>
        </div>

        {/* Right editor card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/70 ring-1 ring-slate-800 w-full max-w-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-slate-700/40 flex items-center justify-center font-medium">JS</div>
                <div>
                  <div className="font-medium">Supereven Challenge</div>
                  <div className="text-xs text-slate-400">JavaScript • index.js</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400 hidden sm:block">Auto-save on</div>
                <button onClick={runCode} className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-sm shadow">{running ? 'Running...' : 'Run'}</button>
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-7 h-[420px] bg-slate-900">
                <MonacoEditor
                  height="420px"
                  defaultLanguage="javascript"
                  defaultValue={SAMPLE_CODE}
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
                  options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on' }}
                />
              </div>

              <div className="col-span-5 p-4 bg-gradient-to-t from-slate-900 to-slate-850">
                <div className="text-sm text-slate-400">Overview</div>
                <div className="mt-3 bg-slate-800 rounded-lg p-3 text-xs text-slate-300">
                  Live results, tests and participant list appear here. This panel mirrors what collaborators see.
                </div>

                <div className="mt-6">
                  <div className="text-xs text-slate-400 mb-2">Output</div>
                  <div className="w-full h-40 bg-slate-900 rounded-md border border-slate-800 p-3 text-xs text-slate-200 overflow-auto">
                    {output || ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-sm text-slate-400 flex items-center justify-between">
              <div>Last synced: Sep 6, 2025</div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div>Theresa S • 45</div>
                <div>Brandon • 40</div>
                <div>Aubrey • 32</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ===== PREMIUM MODAL ===== */}
      {showPremium && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePremium}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
            onClick={stopPropagation}
            role="dialog"
            aria-modal="true"
            aria-label="Premium features dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                  <Gem />
                </div>
                <div>
                  <div className="text-xl font-semibold">Pairon Premium</div>
                  <div className="text-xs text-slate-400">Upgrade to unlock pro features</div>
                </div>
              </div>

              <button
                onClick={closePremium}
                aria-label="Close premium dialog"
                className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-200"
                title="Close"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Play /></div>
                  <div>
                    <div className="font-semibold">Run Code (Live)</div>
                    <div className="text-xs text-slate-400">Get instant execution and richer output panels.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Cpu /></div>
                  <div>
                    <div className="font-semibold">AI Support</div>
                    <div className="text-xs text-slate-400">Contextual code suggestions & smart fixes.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Phone /></div>
                  <div>
                    <div className="font-semibold">Voice Calls</div>
                    <div className="text-xs text-slate-400">In-editor voice for faster collaboration.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Database /></div>
                  <div>
                    <div className="font-semibold">Saved Memory</div>
                    <div className="text-xs text-slate-400">Persist sessions, settings and AI context securely.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="text-slate-300 text-sm">
                <div className="font-medium">Pairon 2.0 will be available soon.</div>
                <div className="text-xs text-slate-500 mt-1">We'll notify early adopters — subscribe for updates when available.</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closePremium}
                  className="rounded-full px-4 py-2 bg-slate-800/40 hover:bg-slate-800 text-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toast.success("Thanks — we'll let you know when Pairon 2.0 is ready!");
                  }}
                  className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white"
                >
                  Notify Me
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ===== HELP MODAL ===== */}
      {showHelp && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeHelp}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-xl mx-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={stopPropagation}
            role="dialog"
            aria-modal="true"
            aria-label="Help dialog"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-700 text-white">
                  <LifeBuoy />
                </div>
                <div>
                  <div className="text-lg font-semibold">Help & FAQ</div>
                  <div className="text-xs text-slate-400">Common answers to help you get started</div>
                </div>
              </div>
              <button onClick={closeHelp} className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-200"><X /></button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <details className="bg-slate-900/40 p-3 rounded">
                <summary className="font-medium">How do I create a room?</summary>
                <p className="mt-2 text-slate-400">Click "Create Unique Room ID" on the home page or paste a shared Room ID and join.</p>
              </details>

              <details className="bg-slate-900/40 p-3 rounded">
                <summary className="font-medium">How do I run code?</summary>
                <p className="mt-2 text-slate-400">Use the Run button in the editor. Premium provides enhanced live-run features.</p>
              </details>

              <details className="bg-slate-900/40 p-3 rounded">
                <summary className="font-medium">Where is my saved data?</summary>
                <p className="mt-2 text-slate-400">Saved sessions and memory are available for Premium users under Pairon 2.0.</p>
              </details>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { closeHelp(); openSupport(); }} className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Contact Support</button>
              <button onClick={closeHelp} className="rounded-full px-4 py-2 bg-slate-800/40 text-slate-200">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ===== SUPPORT MODAL (contact form) ===== */}
      {showSupport && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSupport}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-xl mx-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={stopPropagation}
            role="dialog"
            aria-modal="true"
            aria-label="Support contact form"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-700 text-white"><Mail /></div>
                <div>
                  <div className="text-lg font-semibold">Contact Support</div>
                  <div className="text-xs text-slate-400">We'll reply to the email provided below</div>
                </div>
              </div>
              <button onClick={closeSupport} className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-200"><X /></button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSupportSubmit}>
              <div>
                <label className="text-xs text-slate-400">Your name</label>
                <input value={supportName} onChange={(e) => setSupportName(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-white" placeholder="John Doe" />
              </div>

              <div>
                <label className="text-xs text-slate-400">Email</label>
                <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-white" />
              </div>

              <div>
                <label className="text-xs text-slate-400">Subject</label>
                <input value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-white" placeholder="Short summary" />
              </div>

              <div>
                <label className="text-xs text-slate-400">Message</label>
                <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} rows={5} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-white" placeholder="Describe the issue or request..." />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeSupport} className="rounded-full px-4 py-2 bg-slate-800/40 text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Send</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <footer className="absolute bottom-0 right-0 left-0 border-t border-slate-800 py-1 text-center text-slate-500 text-[15px] max-w-7xl mx-auto w-full">
        ©2025 Pairon — Built with <span className=" text-pink-500">❤</span> by Shashank • Pairon@gmail.com
      </footer>
    </div>
  );
}
