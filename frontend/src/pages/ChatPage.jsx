import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { StreamChat } from "stream-chat";

import "../App.css";

import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { getStreamToken } from "../operations/chat";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();
  const user = useSelector((state) => state.user);
  
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setLoading(true);
      return;
    }

    const client = new StreamChat(apiKey);

    const setupClient = async () => {
      try {
        const token = await getStreamToken();
        await client.connectUser(
          {
            id: user._id,
            name: user.fullName,
            image: user.avatar,
          },
          token
        );
        setChatClient(client);
      } catch (error) {
        console.error("Failed to connect chat client:", error);
        toast.error("Could not connect to chat. Please try again later.");
      }
    };

    setupClient();

    return () => {
      if (client) {
        client.disconnectUser();
        setChatClient(null);
      }
    };
  }, [user?._id]);

  useEffect(() => {
    if (!chatClient || !targetUserId || !user?._id) {
      setChannel(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let currentChannel;

    const createChannel = async () => {
      try {
        const userQuery = await chatClient.queryUsers({ id: { $eq: targetUserId } });
        if (userQuery.users.length === 0) {
          toast.error("This user does not exist or has not used chat yet.");
          setChannel(null);
          return;
        }

        const channelId = [user._id, targetUserId].sort().join("-");
        const newChannel = chatClient.channel("messaging", channelId, {
          name: `Chat with ${userQuery.users[0].name || targetUserId}`,
          members: [user._id, targetUserId],
        });
        
        currentChannel = newChannel;
        await newChannel.watch();
        setChannel(newChannel);

      } catch (error) {
        console.error("Error creating/watching channel:", error);
        toast.error("Could not load chat channel.");
        setChannel(null);
      } finally {
        setLoading(false);
      }
    };

    createChannel();

    return () => {
      if (currentChannel) {
        currentChannel.stopWatching();
      }
      setChannel(null);
    };

  }, [chatClient, targetUserId, user?._id]);


  if (loading || !chatClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <Chat client={chatClient}>
        {channel ? (
          <Channel channel={channel} key={channel.id}>
            <div className="w-full relative">
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-base-200">
            <p className="text-xl text-base-content/70">
              {targetUserId ? "Could not find user to chat with." : "Select a user to start chatting."}
            </p>
          </div>
        )}
      </Chat>
    </div>
  );
}

export default ChatPage;