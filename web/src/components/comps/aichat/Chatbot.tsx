import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const settings = window?.chatbotSettings || {
    position: "right",
    top: "5px",
    right: "150px",
    // showOnRoutes: ["/"],
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const currentPath = window?.location?.pathname;
  // if (
  //   settings.showOnRoutes.length > 0 &&
  //   !settings.showOnRoutes.includes(currentPath)
  // ) {
  //   return null;
  // }

  const containerStyle = {
    position: "fixed",
    zIndex: 9999,
    ...(settings.position === "left" && {
      left: settings.left,
      top: settings.top,
    }),
    ...(settings.position === "right" && {
      right: settings.right,
      top: settings.top,
    }),
    ...(settings.position === "center" && {
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(settings.position === "bottom" && {
      bottom: settings.bottom,
      left: "50%",
      transform: "translateX(-50%)",
    }),
  };

  const chatWindowStyle = {
    display: isOpen ? "flex" : "none",
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: isExpanded ? "100%" : "360px",
    zIndex: 10000,
    borderRadius: "0.5rem",
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const createTypingIndicator = () => (
    <div className="flex flex-col max-w-[75%]">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium text-gray-900">Copilot</span>
      </div>
      <div className="flex items-start space-x-2 bg-gray-50 rounded-lg p-3">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse"></div>
          <div
            className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleUserMessage = async (userPrompt) => {
    if (!userPrompt.trim()) return;

    setInputValue("");
    appendMessage("user", userPrompt);
    setIsTyping(true);

    try {
      const response = await fetch("https://your-api-endpoint/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setIsTyping(false);
      appendMessage(
        "bot",
        data.response ||
          "Of course! What's your query? How can I assist you today?"
      );
    } catch (err) {
      console.error("Error generating response:", err);
      setIsTyping(false);
      appendMessage(
        "bot",
        "I apologize, but I'm having trouble connecting right now. Please try again later."
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUserMessage(inputValue);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <div id="chatbot-container" style={containerStyle}>
      <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#69499F] to-[#FCAE42] inline-block">

        <button
          id="chatbot-toggle"
          onClick={toggleChat}
          className="text-white rounded-lg bg-gradient-to-r from-[#69499F] to-[#FCAE42] px-4 py-2 flex items-center justify-center cursor-pointer transition "
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg> */}
          Copilot
        </button>
        </div>




      </div>

      {/* Chat Window */}
      <div
        id="chatbot-window"
        style={chatWindowStyle}
        className="bg-white flex flex-col border-2 border-solid border-pink-400 rounded-lg"
      >
        {/* Header */}
        <div
          id="chatbot-header"
          className="border-b p-4 flex justify-between items-center bg-white rounded-t-lg"
        >
          <div className="flex items-center">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-pink-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 font-semibold text-gray-900">Breeze</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="chatbot-expand"
              onClick={toggleExpand}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {isExpanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 9l-5-5M4 9h5V4m6 0v5h5M15 9l5-5M15 15l5 5m0-5h-5v5m-6 0v-5H4m5 0l-5 5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
            <button
              id="chatbot-close"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Initial View or Messages */}
        {messages.length === 0 ? (
          <div
            id="chatbot-initial-view"
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="w-16 h-16 mb-4">
              <svg
                className="w-full h-full text-pink-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Breeze Copilot</h2>
                <span
                  className="text-[10px] px-1.5 py-0.5 bg-pink-500 text-white rounded"
                  style={{ borderRadius: "4px" }}
                >
                  Beta
                </span>
              </div>
              <p className="text-gray-600 text-center mt-2">
                How can Breeze Copilot help you?
              </p>
            </div>
          </div>
        ) : (
          <div
            id="chatbot-messages"
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="message-bubble bg-pink-500 text-white rounded-lg px-4 py-2 text-sm max-w-[75%]">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex flex-col max-w-[75%]">
                    <div className="flex items-center mb-2">
                      <span className="text-base font-medium text-gray-900">
                        Copilot
                      </span>
                    </div>
                    <div className="message-bubble text-gray-900 text-sm mb-2">
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 32 32"
                          fill="currentColor"
                        >
                          <path d="M27 11h-8.52L19 9.8A6.42 6.42 0 0 0 13 1a1 1 0 0 0-.93.63L8.32 11H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h18.17a3 3 0 0 0 2.12-.88l3.83-3.83a3 3 0 0 0 .88-2.12V14a3 3 0 0 0-3-3zM4 28V14a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1zm24-3.83a1 1 0 0 1-.29.71l-3.83 3.83a1.05 1.05 0 0 1-.71.29H10V12.19l3.66-9.14a4.31 4.31 0 0 1 3 1.89 4.38 4.38 0 0 1 .44 4.12l-1 2.57A1 1 0 0 0 17 13h10a1 1 0 0 1 1 1z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 32 32"
                          fill="currentColor"
                        >
                          <path d="m29.12 5.71-3.83-3.83A3 3 0 0 0 23.17 1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h3.32l3.75 9.37A1 1 0 0 0 13 31a6.42 6.42 0 0 0 6-8.8l-.52-1.2H27a3 3 0 0 0 3-3V7.83a3 3 0 0 0-.88-2.12zM4 18V4a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1zm24 0a1 1 0 0 1-1 1H17a1 1 0 0 0-.93 1.37l1 2.57a4.38 4.38 0 0 1-.44 4.12 4.31 4.31 0 0 1-3 1.89L10 19.81V3h13.17a1 1 0 0 1 .71.29l3.83 3.83a1 1 0 0 1 .29.71z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 111.07 122.88"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M97.67,20.81l0.01,0.02c3.7,0.01,7.04,1.51,9.46,3.93c2.4,2.41,3.9,5.74,3.9,9.42v75.28c-0.01,3.68-1.51,7.03-3.93,9.46c-2.41,2.4-5.74,3.9-9.42,3.9H38.48c-3.69-0.01-7.04-1.5-9.46-3.93c-2.4-2.41-3.9-5.74-3.91-9.42V25.1c0.01-3.69,1.52-7.04,3.94-9.46c2.41-2.4,5.73-3.9,9.42-3.91C58.22,20.81,77.95,20.81,97.67,20.81z M0.02,75.38L0,13.39c0.01-3.69,1.52-7.04,3.93-9.46c2.41-2.4,5.74-3.9,9.42-3.91h59.19c7.69,0,8.9,9.96,0.01,10.16H13.4c-0.88,0-1.68,0.37-2.27,0.97c-0.59,0.58-0.96,1.4-0.96,2.27v3.17c0,19.61,0,39.21,0,58.81C10.17,83.63,0.02,84.09,0.02,75.38z M100.91,109.49V34.2c0-0.87-0.37-1.68-0.97-2.27c-0.59-0.58-1.4-0.96-2.28-0.96H38.48c-0.88,0-1.68,0.38-2.27,0.97c-0.59,0.58-0.96,1.4-0.96,2.27v75.28c0,0.88,0.38,1.68,0.97,2.27c0.59,0.59,1.4,0.96,2.27,0.96h59.19c0.87,0,1.68-0.38,2.27-0.97c0.59-0.58,0.96-1.4,0.96-2.27z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && createTypingIndicator()}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Section */}
        <div id="chatbot-input" className="border-t p-4 bg-white rounded-b-lg">
          <div className="relative">
            <input
              id="chatbot-input-field"
              type="text"
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400 text-xs">©</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            AI-generated content may be inaccurate. See terms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
