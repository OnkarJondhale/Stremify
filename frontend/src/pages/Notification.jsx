import { useState, useEffect } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

import { getFriendRequests, acceptFriendRequest, getMyFriends } from '../operations/friends';
import { formatRelativeTime } from '../utils/timeconversion'; 

const NotificationItem = ({ avatar, title, subtitle, children }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-3 my-2 bg-base-100 dark:bg-base-300 rounded-lg shadow-sm">
    <div className="flex items-center gap-4">
      <img src={avatar} alt="User avatar" className="size-12 rounded-full object-cover" />
      <div className="flex flex-col">
        <span className="font-semibold text-base-content">{title}</span>
        {subtitle && <span className="text-sm text-base-content/70">{subtitle}</span>}
      </div>
    </div>
    <div className="mt-2 sm:mt-0 ml-auto sm:ml-4 flex-shrink-0">
      {children}
    </div>
  </div>
);

function Notification() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [newConnections, setNewConnections] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const requests = await getFriendRequests();
            const friends = await getMyFriends();
            setFriendRequests(requests || []);
            setNewConnections(friends || []);
        }
        fetchData();
    }, []);

    async function acceptFriendRequestHandler(senderId, index) {
        const response = await acceptFriendRequest(senderId); 
        if (response) {
            setFriendRequests(prev => prev.filter((_, i) => i !== index));
        }
    }

    function rejectFriendRequestHandler(senderId) {
        console.log("Rejecting request from:", senderId);
    }

    return (
        <div className="h-full w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-base-content">Notifications</h1>

            <div className='w-full border border-primary'> </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                    <PersonAddIcon sx={{ fontSize: 22 }} />
                    <span className="text-base-content text-lg font-semibold">Friend Requests</span>
                    <span className="bg-primary text-primary-content text-xs font-bold size-5 rounded-full flex items-center justify-center">
                        {friendRequests.length}
                    </span>
                </div>
                <div className={`${friendRequests.length > 0? 'h-36 sm:h-60' : ''} flex flex-col overflow-y-auto`}>
                    {friendRequests.length > 0 ? (
                        friendRequests.map((req, index) => (
                            <NotificationItem
                                key={req._id}
                                avatar={req.sender?.avatar}
                                title={req.sender?.fullName}
                                subtitle={req.sender?.nativeLanguage}
                            >
                                <div className='flex gap-2'>
                                    <button
                                        className='btn btn-sm btn-accent text-accent-content'
                                        onClick={() => acceptFriendRequestHandler(req.sender?._id, index)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className='btn btn-sm btn-ghost'
                                        onClick={() => rejectFriendRequestHandler(req.sender?._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </NotificationItem>
                        ))
                    ) : (
                        <p className="text-base-content/60 p-4 text-center">No new friend requests.</p>
                    )}
                </div>
            </div>

            <div className='w-full border border-primary'> </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-secondary">
                    <CircleNotificationsIcon sx={{ fontSize: 22 }} />
                    <span className="text-base-content text-lg font-semibold">New Connections</span>
                </div>
                <div className={`${newConnections.length > 0 ? 'h-36 sm:h-60' : ''} flex flex-col overflow-y-auto`}>
                    {newConnections.length > 0 ? (
                        newConnections.map((conn) => (
                            <NotificationItem
                                key={conn._id}
                                avatar={conn.receiver?.avatar}
                                title={conn.receiver?.username}
                                subtitle="Accepted your friend request."
                            >
                                <span className="text-xs text-base-content/70 whitespace-nowrap">
                                    {formatRelativeTime(conn.updatedAt)}
                                </span>
                            </NotificationItem>
                        ))
                    ) : (
                        <p className="text-base-content/60 p-4 text-center">No recent connections.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Notification;