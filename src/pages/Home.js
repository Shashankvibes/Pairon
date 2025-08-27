import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
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

        // Redirect
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

    return (
        <div className="homePageWrapper">
            {/* 2 column layout */}
            <div className="contentWrapper">
                {/* Left Side GIF */}
                <div className="leftIllustration">
                    <img src="/home7.gif" alt="illustration" className="illustrationGif" />
                </div>

                {/* Right Side Form */}
                <div className="formWrapper">
                    <img
                        className="homePageLogo"
                        src="/final1.png"
                        alt="logo"
                    />
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
                            <a
                                onClick={createNewRoom}
                                href=""
                                className="createNewBtn"
                            >
                                Create Unique Room ID
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer>
                <h4>
                    Built with❤️&nbsp;by&nbsp;
                    <a href="https://www.linkedin.com/in/shashank-chaturvedi-49ba91308/">Shashank</a>
                </h4>
            </footer>
        </div>
    );
};

export default Home;
