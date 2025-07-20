import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import SearchFriend from "../components/SearchFriend";

import { getAllFriends } from "../operations/friends";

function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const data = await getAllFriends();
            setFriends(data || []);
            setFilteredFriends(data || []);
            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredFriends(friends);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const results = friends.filter(friend =>
                friend?.fullName?.toLowerCase().includes(lowercasedTerm) ||
                friend?.username?.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredFriends(results);
        }
    }, [searchTerm, friends]);

    const handleFindFriendsClick = () => {
        navigate("/");
    };

    function videoCallHandler(id)
    {
        window.open(`/videocall/${id}`,'_blank')
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {isLoading ? (
                <div className="text-center p-10"><span className="loading loading-dots loading-lg text-primary"></span></div>
            ) : friends?.length === 0 ? (
                <div className="text-center p-8 bg-base-200 rounded-lg flex flex-col items-center gap-4">
                    <h3 className="text-xl font-bold text-base-content">It's a Bit Quiet Here...</h3>
                    <p className="text-base-content/70 max-w-sm">
                        Your friends list is empty. Let's find some new people to connect with!
                    </p>
                    <button
                        className="btn btn-primary gap-2"
                        onClick={handleFindFriendsClick}
                    >
                        <AddIcon />
                        Find Friends
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <h2 className="text-lg lg:text-2xl font-bold text-primary">Your Friends ({friends?.length || 0})</h2>
                        <div className="form-control w-full sm:w-auto relative">
                            <input
                                type="text"
                                placeholder="Filter friends by name or username…"
                                className="input input-bordered w-[80%] sm:w-80 pr-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm.length > 0 && (
                                <button
                                    className="btn btn-ghost btn-circle btn-xs absolute top-1/2 right-2 -translate-y-1/2"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <CloseIcon sx={{ fontSize: 18 }} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        {filteredFriends?.length > 0 ? (
                            filteredFriends.map(friend => (
                                <div
                                    key={friend._id}
                                    className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-2 w-full p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                                >
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full ring-primary ring-offset-base-100 ring-offset-1">
                                                <img src={friend.avatar} alt={`${friend.fullName}'s avatar`} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">{friend.fullName}</div>
                                            <div className="text-sm text-base-content/70">@{friend.username}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <button className="btn btn-primary btn-sm flex-1 sm:flex-grow-0" onClick={()=>{ navigate(`/chat/${friend._id}`) }}>
                                            <ChatIcon sx={{ fontSize: 18 }} />
                                            <span className="hidden sm:inline ml-2">Chat</span>
                                        </button>
                                        <button className="btn btn-secondary btn-sm flex-1 sm:flex-grow-0" onClick={() => {videoCallHandler(friend._id)} }>
                                            <VideocamIcon sx={{ fontSize: 20 }} />
                                            <span className="hidden sm:inline ml-2">Call</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-10 text-base-content/70">
                                No friends found matching "{searchTerm}".
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function Friends() {
    return (
        <div className="min-h-screen w-full p-2 md:p-4 flex flex-col gap-8 overflow-y-auto pb-8">
            <SearchFriend />
            <div className="divider text-accent">Your Friends</div>
            <FriendsList />
        </div>
    );
}

export default Friends;