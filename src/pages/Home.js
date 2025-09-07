// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Gem,
  LifeBuoy,
  Headphones,
  X,
  Mail,
  Play,
  Phone,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();

  // room / user state (existing logic kept intact)
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  // modal state (new)
  const [showPremium, setShowPremium] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // support form state
  const YOUR_EMAIL = 'shashankchaturvedi320@gmail.com';
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState(YOUR_EMAIL);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Keep existing behavior
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('ROOM ID & username is a required field');
      return;
    }

    // Redirect to editor (existing)
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  // modal helpers
  const closeAll = () => {
    setShowPremium(false);
    setShowHelp(false);
    setShowSupport(false);
  };
  const stopPropagation = (e) => e.stopPropagation();

  // close on ESC + lock scroll while modal open
  useEffect(() => {
    const anyOpen = showPremium || showHelp || showSupport;
    const onKey = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    if (anyOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showPremium, showHelp, showSupport]);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) {
      toast.error('Please fill name, email and message.');
      return;
    }
    // placeholder - replace with real submission
    console.log({
      name: supportName,
      email: supportEmail,
      subject: supportSubject,
      message: supportMessage,
    });
    toast.success("Support request sent. We'll reply to " + supportEmail);
    setSupportSubject('');
    setSupportMessage('');
    setShowSupport(false);
  };

  return (
    <div className="homePageWrapper">
      {/* NAVBAR: upgraded to match landing features & style */}
      <nav className="topNav navBorder" role="navigation" aria-label="Top navigation">
        <div className="flex items-center gap-3">
          {/* larger brand logo (keeps background transparent) */}
          {/* <img src="/final1.png" alt="brand logo" className="w-14 h-14 rounded-xl object-contain shadow-lg" /> */}
        </div>

        <div className="topNav-actions" style={{ marginRight: 8 }}>
          <button
            className="navItem"
            aria-label="Go to landing"
            title="Go to landing"
            type="button"
            onClick={() => navigate('/')}
          >
            <span className="navIconWrap">
              <HomeIcon size={16} strokeWidth={2} />
            </span>
            <span className="navLabel">Home</span>
          </button>

          <button
            className="navItem"
            aria-label="Premium"
            title="Premium"
            onClick={() => setShowPremium(true)}
          >
            <span className="navIconWrap">
              <Gem size={16} strokeWidth={2} />
            </span>
            <span className="navLabel">Premium</span>
          </button>

          <button
            className="navItem"
            aria-label="Help"
            title="Help"
            onClick={() => setShowHelp(true)}
          >
            <span className="navIconWrap">
              <LifeBuoy size={16} strokeWidth={2} />
            </span>
            <span className="navLabel">Help</span>
          </button>

          <button
            className="navItem"
            aria-label="Support"
            title="Support"
            onClick={() => setShowSupport(true)}
          >
            <span className="navIconWrap">
              <Headphones size={16} strokeWidth={2} />
            </span>
            <span className="navLabel">Support</span>
          </button>
        </div>
      </nav>

      {/* MAIN 2-column layout (existing logic kept) */}
      <div className="contentWrapper">
        <div className="leftIllustration">
          <img src="/home7.gif" alt="illustration" className="illustrationGif" />
        </div>

        <div className="formWrapper">
          <img className="homePageLogo" src="/final1.png" alt="logo" />
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="Room Id"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              If you don't have an invite then create &nbsp;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                Create Unique Room ID
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER unchanged (kept as requested) */}
      <footer className="footerBorder">
        <h4>
          Built with❤️&nbsp;by&nbsp;
          <a href="https://www.linkedin.com/in/shashank-chaturvedi-49ba91308/">Shashank</a>
        </h4>
      </footer>

      {/* PREMIUM MODAL */}
      {showPremium && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPremium(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
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
                <img src="/final1.png" alt="brand logo" className="w-10 h-10 object-contain rounded-md shadow" />
                <div>
                  <div className="text-xl font-semibold">Premium</div>
                  <div className="text-xs text-slate-400">Upgrade to unlock pro features</div>
                </div>
              </div>

              <button
                onClick={() => setShowPremium(false)}
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
                  <div className="p-2 rounded bg-slate-800/40"><Play size={18} /></div>
                  <div>
                    <div className="font-semibold">Run Code (Live)</div>
                    <div className="text-xs text-slate-400">Instant execution and richer outputs.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Gem size={18} /></div>
                  <div>
                    <div className="font-semibold">AI Support</div>
                    <div className="text-xs text-slate-400">Contextual suggestions and fixes.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Phone size={18} /></div>
                  <div>
                    <div className="font-semibold">Voice Calls</div>
                    <div className="text-xs text-slate-400">In-editor voice for faster collaboration.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800/40"><Database size={18} /></div>
                  <div>
                    <div className="font-semibold">Saved Memory</div>
                    <div className="text-xs text-slate-400">Persist sessions, settings and AI context.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="text-slate-300 text-sm">
                <div className="font-medium">Pairon 2.0 will be available soon.</div>
                <div className="text-xs text-slate-500 mt-1">We'll notify early adopters — subscribe for updates.</div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setShowPremium(false)} className="rounded-full px-4 py-2 bg-slate-800/40 hover:bg-slate-800 text-slate-200">Close</button>
                <button onClick={() => toast.success("Subscribed — we'll notify you!")} className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Notify Me</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* HELP MODAL */}
      {showHelp && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowHelp(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/50" />
          <motion.div className="relative z-10 w-full max-w-xl mx-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 shadow-2xl" onClick={stopPropagation}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-700 text-white"><LifeBuoy /></div>
                <div>
                  <div className="text-lg font-semibold">Help & FAQ</div>
                  <div className="text-xs text-slate-400">Common answers to get started</div>
                </div>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-200"><X /></button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <details className="bg-slate-900/40 p-3 rounded"><summary className="font-medium">How do I create a room?</summary><p className="mt-2 text-slate-400">Use Create Unique Room ID or paste a received Room ID.</p></details>
              <details className="bg-slate-900/40 p-3 rounded"><summary className="font-medium">How do I run code?</summary><p className="mt-2 text-slate-400">Use the Run button in the editor. Premium adds advanced run features.</p></details>
              <details className="bg-slate-900/40 p-3 rounded"><summary className="font-medium">Where is my saved data?</summary><p className="mt-2 text-slate-400">Saved sessions available for Premium users under Pairon 2.0.</p></details>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { setShowHelp(false); setShowSupport(true); }} className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Contact Support</button>
              <button onClick={() => setShowHelp(false)} className="rounded-full px-4 py-2 bg-slate-800/40 text-slate-200">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* SUPPORT MODAL */}
      {showSupport && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowSupport(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/60" />
          <motion.div className="relative z-10 w-full max-w-xl mx-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 shadow-2xl" onClick={stopPropagation}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-700 text-white"><Mail /></div>
                <div>
                  <div className="text-lg font-semibold">Contact Support</div>
                  <div className="text-xs text-slate-400">We'll reply to the email provided below</div>
                </div>
              </div>
              <button onClick={() => setShowSupport(false)} className="p-2 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-200"><X /></button>
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
                <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} rows={5} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-white" placeholder="Describe the issue..." />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowSupport(false)} className="rounded-full px-4 py-2 bg-slate-800/40 text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">Send</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
