import React, { useState, useEffect } from "react";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useSelector } from "react-redux";
import AttractionsIcon from "@mui/icons-material/Attractions";
import CloseIcon from '@mui/icons-material/Close'; 
import { toast } from "react-hot-toast";
import { getStreamToken } from "../operations/chat";
import { useParams } from "react-router-dom"; 

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const VideoCallPageNavbar = () => {
  return (
    <div className="min-h-12 w-full p-2 flex justify-between items-center relative z-10 border-b border-secondary">
      <div className="flex items-center gap-2 text-primary p-2">
        <AttractionsIcon sx={{ fontSize: 30 }} />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
          Streamify
        </h1>
      </div>
    </div>
  );
};

const CallEndedScreen = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-base-content">
                Call Has Ended
            </h2>
            <p className="text-lg text-base-content/70 max-w-md">
                You have left the call. You can now safely close this window.
            </p>
            <button
                className="btn btn-primary btn-wide mt-4 gap-2"
                onClick={() => window.close()}
            >
                <CloseIcon />
                Close Window
            </button>
        </div>
    );
};


const VideoCallPage = () => {
  const user = useSelector((state) => state.user);
  const { id: friendId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCallEnd, setIsCallEnd] = useState(false);

  useEffect(() => {
    if (!user?._id || !friendId) {
      setLoading(true);
      return;
    }

    let videoClient;

    const setupVideoCall = async () => {
      try {
        const token = await getStreamToken();
        videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user._id,
            name: user.fullName,
            image: user.avatar,
          },
          token,
        });
        
        const callId = [user._id, friendId].sort().join('-');

        const newCall = videoClient.call("default", callId);

        await newCall.join({ create: true });
        await newCall.camera.enable();
        await newCall.microphone.enable();

        setClient(videoClient);
        setCall(newCall);

      } catch (error) {
        console.error("Error setting up video call:", error);
        toast.error("Could not start the video call. Check permissions and try again.");
      } finally {
        setLoading(false);
      }
    };

    setupVideoCall();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [user?._id, friendId]);

  const handleLeaveCall = async () => {
    toast.success("Call ended.");
    try {
        if (call.camera.state.status === 'enabled') {
            await call.camera.disable();
        }
        if (call.microphone.state.status === 'enabled') {
            await call.microphone.disable();
        }
    } catch (error) {
        console.error("Failed to disable media devices on leave", error);
    }
    setIsCallEnd(true);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (!client || !call) {
    return (
        <div className="h-screen w-full flex flex-col bg-base-100">
            <VideoCallPageNavbar />
            <CallEndedScreen />
        </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-base-100">
      <VideoCallPageNavbar />
      {
        !isCallEnd ? (
            <StreamVideo client={client}>
                <StreamCall call={call}>
                <StreamTheme>
                    <SpeakerLayout />
                    <CallControls 
                        onLeave={handleLeaveCall}
                    />
                </StreamTheme>
                </StreamCall>
            </StreamVideo>
        ) : (
            <CallEndedScreen />
        )
      }
    </div>
  );
};

export default VideoCallPage;