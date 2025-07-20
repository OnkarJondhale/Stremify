import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import ContentSlider from "./ContentSlider";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import FilterListIcon from '@mui/icons-material/FilterList';

import { getRecommendedFriends, sendFriendRequest, getoutgoingfriendrequest, getFriendRequests, acceptFriendRequest,rejectFriendRequest } from "../operations/friends";

function Dashboard() {
    const user = useSelector((state) => state.user);
    const [recommendedFriends, setRecommendedFriends] = useState([]);
    const [currUserSentFriendRequests, setCurrUserSentFriendRequests] = useState([]);
    const [loading, setLoading] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
    const [filters, setFilters] = useState({
        country: '',
        nativeLanguage: '',
        proficientLanguage: '',
        requestStatus: 'all',
    });

    // --- Data Fetching ---
    useEffect(() => {
        if (!user || !user._id) return;
        async function getInitialData() {
            const [recommendedData, sentRequestsData, incomingRequestsData] = await Promise.all([
                getRecommendedFriends(),
                getoutgoingfriendrequest(),
                getFriendRequests()
            ]);
            setRecommendedFriends(recommendedData || []);
            setCurrUserSentFriendRequests(sentRequestsData || []);
            setIncomingFriendRequests(incomingRequestsData || []);
        }
        getInitialData();
    }, [user]);

    async function acceptFriendRequestHandler(senderId) {
        setLoading(prev => ({ ...prev, [senderId]: true }));
        try {
            const res = await acceptFriendRequest(senderId);
            if (res) {
                setIncomingFriendRequests(prev =>
                    prev.filter(req =>
                        req.sender._id !== senderId
                    )
                );
                setRecommendedFriends(prev =>
                prev.filter(friend => friend._id !== senderId)
            );
            }
        } finally {
            setLoading(prev => ({ ...prev, [senderId]: false }));
        }
    }

    async function rejectFriendRequestHandler(senderId) {
        setLoading(prev => ({ ...prev, [senderId]: true }));
        try {
            // Implement rejectFriendRequest in your operations/friends.js
            await rejectFriendRequest(senderId);
            setIncomingFriendRequests(prev =>
                prev.filter(req =>
                    req.sender._id !== senderId
                )
            );
        } finally {
            setLoading(prev => ({ ...prev, [senderId]: false }));
        }
    }

    // --- Click Handler with Robust Instant UI Update ---
    async function sendFriendRequestClickHandler(receiverId) {
        setLoading(prev => ({ ...prev, [receiverId]: true }));
        try {
            const newRequest = await sendFriendRequest(receiverId);
            if (newRequest) {
                // Mark as sent in local state immediately
                setRecommendedFriends(prevFriends =>
                    prevFriends.map(friend =>
                        friend._id === receiverId
                            ? { ...friend, requestSent: true }
                            : friend
                    )
                );
                // Use the real backend response structure for outgoing requests
                setCurrUserSentFriendRequests(prev => [
                    ...prev,
                    newRequest // This should be the full friend request object from backend
                ]);
            }
        } catch (error) {
            console.error("Failed to send friend request:", error);
        } finally {
            setLoading(prev => ({ ...prev, [receiverId]: false }));
        }
    }

    // --- Filter Handlers ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            country: '',
            nativeLanguage: '',
            proficientLanguage: '',
            requestStatus: 'all',
        });
    };

    // --- Memoized Filtering Logic ---
    const filteredFriends = useMemo(() => {
        return recommendedFriends.filter(user => {
            const isRequestSent =
                user.requestSent ||
                currUserSentFriendRequests.some(
                    req =>
                        req.receiver === user._id ||
                        (req.receiver && req.receiver._id === user._id)
                );
            if (filters.requestStatus === 'sent' && !isRequestSent) return false;
            if (filters.requestStatus === 'not-sent' && isRequestSent) return false;

            if (filters.country && !(user.country || '').toLowerCase().includes(filters.country.toLowerCase())) {
                return false;
            }
            if (filters.nativeLanguage && !(user.nativeLanguage || '').toLowerCase().includes(filters.nativeLanguage.toLowerCase())) {
                return false;
            }
            if (filters.proficientLanguage) {
                try {
                    const proficient = JSON.parse(user.proficientLanguages[0] || '[]');
                    const hasLanguage = proficient.some(lang => lang.toLowerCase().includes(filters.proficientLanguage.toLowerCase()));
                    if (!hasLanguage) return false;
                } catch {
                    return false;
                }
            }
            return true;
        });
    }, [recommendedFriends, filters, currUserSentFriendRequests]);

    return (
        <>
            <div className="min-h-screen w-full p-2 flex flex-col gap-2 overflow-y-scroll pb-8">
                <ContentSlider autoSlideInterval={5000}>
                    {/* ... ContentSlider JSX ... */}
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="avatar mb-4">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
                            </div>
                        </div>
                        <h2 className="md:text-4xl font-bold text-primary text-xs">
                            Connect Instantly
                        </h2>
                        <p className="mt-2 max-w-md text-base-content/80 text-xs sm:text-sm">
                            Start a video call or chat with friends and family in crystal-clear quality. Your next conversation is just a click away.
                        </p>
                        <button className="btn btn-primary btn-wide mt-2 text-xs sm:text-sm">Start a Call</button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center h-full gap-6 p-4">
                        <div className="w-full md:w-1/2">
                            <h2 className="md:text-4xl font-bold text-secondary text-center md:text-left text-sm">
                                Your Tribe Awaits
                            </h2>
                            <p className="mt-2 text-base-content/80 text-center md:text-left text-xs sm:text-sm">
                                Create or join groups for your hobbies, projects, or just for fun. Share memes, plan events, and stay connected.
                            </p>
                            <div className="text-center md:text-left">
                                <button className="btn btn-secondary mt-2 text-xs sm:text-sm">Explore Groups</button>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center">
                            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                                <div className="avatar">
                                    <div className="w-16">
                                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Group member 1" />
                                    </div>
                                </div>
                                <div className="avatar">
                                    <div className="w-16">
                                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="Group member 2" />
                                    </div>
                                </div>
                                <div className="avatar">
                                    <div className="w-16">
                                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704g" alt="Group member 3" />
                                    </div>
                                </div>
                                <div className="avatar">
                                    <div className="w-16">
                                        <img src="https://i.pravatar.cc/150?u=a049871f4e290279804g" alt="Group member 3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full text-center bg-base-100 rounded-lg p-4" style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23374151'%3e%3cpath d='M0 .5 L31.5 .5 M.5 0 L.5 32'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'repeat',
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-3xl md:text-4xl font-bold text-accent">
                            Always Private, Always Secure
                        </h2>
                        <p className="mt-2 max-w-md text-base-content/80">
                            Your conversations are end-to-end encrypted. What you say stays between you.
                        </p>
                    </div>
                </ContentSlider>

                <div className="w-full border-[1px] border-primary mt-1"> </div>
                <div className="w-full flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-accent text-2xl font-bold">Meet New People</h1>
                        <button className="btn btn-ghost gap-2" onClick={() => setIsFilterVisible(!isFilterVisible)}>
                            <FilterListIcon />
                            Filter
                        </button>
                    </div>
                    <p className="text-sm text-base-content/70 max-w-2xl">
                        Discover people with similar interests to start a conversation and have fun.
                    </p>

                    {
                        (!filteredFriends || filteredFriends.length==0) && 
                        <div className="mt-4 font-bold text-primary text-xl"> Oops! no friend recommendation </div>
                    }

                    {isFilterVisible && (
                        <div className="bg-base-200 p-4 rounded-lg flex flex-wrap gap-4 items-end">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Country</span></label>
                                <input type="text" name="country" value={filters.country} onChange={handleFilterChange} className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Native Language</span></label>
                                <input type="text" name="nativeLanguage" value={filters.nativeLanguage} onChange={handleFilterChange} className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Proficient In</span></label>
                                <input type="text" name="proficientLanguage" value={filters.proficientLanguage} onChange={handleFilterChange} className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Request Status</span></label>
                                <select name="requestStatus" value={filters.requestStatus} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
                                    <option value="all">All</option>
                                    <option value="sent">Sent</option>
                                    <option value="not-sent">Not Sent</option>
                                </select>
                            </div>
                            <button className="btn btn-ghost" onClick={resetFilters}>Reset</button>
                        </div>
                    )}

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-4">
                        {filteredFriends.map((user) => {
                            const isRequestSent =
                                user.requestSent ||
                                currUserSentFriendRequests.some(
                                    req =>
                                        req.receiver === user._id ||
                                        (req.receiver && req.receiver._id === user._id)
                                );

                            const incomingRequest = incomingFriendRequests.find(
                                req => req.sender._id === user._id
                            );

                            return (
                                <div key={user._id} className="card bg-base-100 shadow-xl transition-transform hover:-translate-y-1 flex flex-col">
                                    <figure className="h-20 bg-gradient-to-r from-primary to-secondary flex-shrink-0" />
                                    <div className="card-body items-center text-center p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="avatar -mt-12">
                                                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                    <img src={user.avatar} alt={`${user.fullName}'s avatar`} />
                                                </div>
                                            </div>
                                            <h2 className="w-full mt-2 text-center text-xl font-mono font-semibold">{user.fullName}</h2>
                                            <p className="text-sm text-base-content/70 -mt-1"> <LocationPinIcon sx={{ fontSize: 15 }} /> {user.address} {user.country ? ', ' + user.country : ''}</p>
                                            <div className="w-full text-sm text-left text-base-content/80 my-3 p-2 bg-base-200 rounded-lg max-h-24 overflow-y-auto">
                                                {user.bio || "This user hasn't added a bio yet."}
                                            </div>
                                            <div className="flex flex-wrap justify-center gap-1">
                                                <div className="badge badge-accent badge-outline">{user.nativeLanguage}</div>
                                                {(() => {
                                                    try {
                                                        const langs = JSON.parse(user.proficientLanguages[0] || '[]');
                                                        return langs.slice(0, 4).map((lang, idx) => (
                                                            <div key={idx} className="badge badge-outline">{lang}</div>
                                                        ));
                                                    } catch { return null; }
                                                })()}
                                            </div>
                                        </div>
                                        <div className="card-actions w-full pt-4">
                                            {incomingRequest ? (
                                                <div className="w-full flex gap-4 justify-center items-center">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        disabled={loading[user._id]}
                                                        onClick={() => acceptFriendRequestHandler(user._id)}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-sm"
                                                        disabled={loading[user._id]}
                                                        onClick={() => rejectFriendRequestHandler(user._id)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : isRequestSent ? (
                                                <button className="btn btn-success btn-block" disabled>
                                                    <CheckIcon /> Request Sent
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-block flex gap-1"
                                                    onClick={() => sendFriendRequestClickHandler(user._id)}
                                                    disabled={loading[user._id]}
                                                >
                                                    {loading[user._id] ? <span className="loading loading-spinner"></span> : <AddIcon />}
                                                    {loading[user._id] ? "Sending..." : "Send Friend Request"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;