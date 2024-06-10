import React, { useEffect, useRef } from "react";
import OT, { Session, Publisher, Stream } from "@opentok/client";

interface ChatScreenProps {
  sessionId: string;
  token: string;
  apiKey: string;
  camera: string;
  mic: string;
  onLeave: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  sessionId,
  token,
  apiKey,
  camera,
  mic,
  onLeave,
}) => {
  const sessionRef = useRef<Session | null>(null);
  const publisherRef = useRef<Publisher | null>(null);
  const publisherDivRef = useRef<HTMLDivElement | null>(null);
  const subscriberDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Initialize the OpenTok session
        const otSession = OT.initSession(apiKey, sessionId);
        sessionRef.current = otSession;

        console.log("OpenTok session initialized:", sessionId);

        // When a new stream is created in the session, subscribe to it
        otSession.on("streamCreated", (event: { stream: Stream }) => {
          console.log("Stream created:", event.stream);

          if (subscriberDivRef.current) {
            const subscriberOptions = {
              insertMode: "append" as const,
            };

            // Check if already subscribed to this stream
            const subscribers = otSession.getSubscribersForStream(event.stream);
            if (!subscribers.length) {
              otSession.subscribe(
                event.stream,
                subscriberDivRef.current,
                subscriberOptions,
                (err) => {
                  if (err) {
                    console.error("Failed to subscribe to stream:", err);
                  } else {
                    console.log("Subscribed to stream:", event.stream.streamId);
                  }
                }
              );
            }
          }
        });

        // Handle stream destroyed event
        otSession.on("streamDestroyed", (event: { stream: Stream }) => {
          console.log("Stream destroyed:", event.stream);
        });

        // Handle session disconnected event
        otSession.on("sessionDisconnected", (event) => {
          console.log("Session disconnected:", event.reason);
        });

        // Connect to the session
        otSession.connect(token, (error) => {
          if (error) {
            console.error("Failed to connect to session:", error);
          } else {
            console.log("Connected to session:", sessionId);

            // Create a publisher to capture the local media
            const publisherOptions = {
              insertMode: "append" as const,
              videoSource: camera || undefined,
              audioSource: mic || undefined,
              publishAudio: false,
            };

            if (publisherDivRef.current) {
              // Unpublish any existing publisher
              if (publisherRef.current) {
                if (publisherRef.current.session) {
                  sessionRef.current?.unpublish(publisherRef.current);
                }
                publisherRef.current.destroy();
                publisherRef.current = null;
              }

              // Initialize the publisher
              publisherRef.current = OT.initPublisher(
                publisherDivRef.current,
                publisherOptions,
                (err) => {
                  if (err) {
                    console.error("Failed to initialize publisher:", err);
                  } else {
                    console.log(
                      "Publisher initialized:",
                      publisherRef.current?.stream?.streamId
                    );
                    if (sessionRef.current && publisherRef.current) {
                      sessionRef.current.publish(
                        publisherRef.current,
                        (err) => {
                          if (err) {
                            console.error("Failed to publish stream:", err);
                          } else {
                            console.log(
                              "Published stream:",
                              publisherRef.current?.stream?.streamId
                            );
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        });
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    };

    initializeSession();

    // Cleanup function
    return () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
    };
  }, [sessionId, token, apiKey, camera, mic]);

  const handleLeaveClick = () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    if (publisherRef.current) {
      if (publisherRef.current.session) {
        sessionRef.current?.unpublish(publisherRef.current);
      }
      publisherRef.current.destroy();
    }
    onLeave();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-row">
        {/* Local video container */}
        <div className="relative flex bg-gray-300 ">
          <div ref={publisherDivRef} id="publisher" className="h-full w-full" />
        </div>
        {/* Remote video container */}
        <div className="relative flex-row flex-wrap gap-4 bg-gray-300">
          <div
            ref={subscriberDivRef}
            id="subscriber"
            className="h-full w-full"
          />
        </div>
      </div>
      <button
        className="px-6 py-2 mt-4 bg-red-500 text-white rounded-md"
        onClick={handleLeaveClick}
      >
        Leave Call
      </button>
    </div>
  );
};

export default ChatScreen;
