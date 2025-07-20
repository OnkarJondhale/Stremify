import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { searchFriend, sendFriendRequest } from '../operations/friends';

function SearchFriend() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState({});
    const [sentRequests, setSentRequests] = useState([]);

    useEffect(() => {
        const delayDebounceTimer = setTimeout(async () => {
            if (searchTerm.trim()) {
                setIsLoading(true);
                const results = await searchFriend(searchTerm);
                setSearchedUsers(results || []);
                setIsLoading(false);
            } else {
                setSearchedUsers([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceTimer);
    }, [searchTerm]);

    const handleSendRequest = async (userId) => {
        setButtonLoading(prev => ({ ...prev, [userId]: true }));
        try {
            const newRequest = await sendFriendRequest(userId);
            if (newRequest) {
                setSentRequests(prev => [...prev, userId]);
            }
        } catch (error) {
            console.error("Failed to send friend request from component:", error);
        } finally {
            setButtonLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    return (
        <div className="w-full p-2 md:p-4 flex flex-col gap-4 items-center">
            <div className="w-full text-center mb-4">
                <h1 className="text-accent text-3xl font-bold">Find New Friends</h1>
                <p className="text-sm text-base-content/70 max-w-2xl mx-auto mt-1">
                    Search for people by their full name or email address to connect with them.
                </p>
            </div>

            {/* FIXED #1: Added `relative` to this container to act as an anchor */}
            <div className="w-full max-w-lg relative">
                <div className="form-control relative">
                    <input
                        type="text"
                        placeholder="e.g., HellBoy69 or hellboy69@gmail.com"
                        className="input input-bordered w-full pr-16"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
                        {searchTerm.length > 0 && !isLoading && (
                            <button
                                type="button"
                                className="btn btn-ghost btn-circle btn-xs"
                                onClick={() => setSearchTerm('')}
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </button>
                        )}
                        {isLoading && (
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                        )}
                    </div>
                </div>

                {searchTerm && (
                    /* FIXED #2: Added `absolute` to the results list */
                    <ul className="absolute menu bg-base-200 w-full rounded-box mt-2 shadow-lg z-10 p-2">
                        <div className="text-xs text-base-content/60 px-4 py-2 font-semibold">
                            {isLoading ? 'Searching...' : `Found ${searchedUsers?.length || 0} result(s)`}
                        </div>

                        {searchedUsers?.length > 0 ? (
                            searchedUsers.map(user => {
                                const isRequestSent = sentRequests.includes(user._id);
                                return (
                                    <li key={user._id} className="rounded-lg">
                                        <div className="flex justify-between items-center w-full p-2 hover:bg-base-100">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full">
                                                        <img src={user.avatar} alt={`${user.fullName}'s avatar`} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.fullName}</div>
                                                    <div className="text-sm opacity-70">{user.email}</div>
                                                </div>
                                            </div>

                                            {isRequestSent ? (
                                                <button className="btn btn-success btn-sm gap-2" disabled>
                                                    <CheckIcon sx={{ fontSize: 16 }} /> Sent
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm btn-outline gap-2"
                                                    onClick={() => handleSendRequest(user._id)}
                                                    disabled={buttonLoading[user._id]}
                                                >
                                                    {buttonLoading[user._id] ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        <AddIcon sx={{ fontSize: 16 }} />
                                                    )}
                                                    {buttonLoading[user._id] ? "Adding..." : "Add"}
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        ) : !isLoading && (
                            <li className="text-center p-4 text-base-content/60">
                                No users found.
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SearchFriend;