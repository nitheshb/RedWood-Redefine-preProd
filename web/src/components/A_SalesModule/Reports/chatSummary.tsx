import React, { useState, useEffect } from 'react'
import './Chat.css'

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('chatMessages')
    return storedMessages ? JSON.parse(storedMessages) : []
  })

  const [newMessage, setNewMessage] = useState('')
  const [questions] = useState([
    'How are you?',
    'What is your name?',
    //"Where are you from?",
    'What do you do?',
    'How can I help you?',
    'Do you have any hobbies?',
    'Can you tell me a joke?',
    'What is your favorite color?',
  ])

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = (message) => {
    const timestamp = new Date().toISOString()
    const newChatUser = {
      id: messages.length + 1,
      sender: 'User',
      message: message,
      timestamp: timestamp,
    }
    setMessages([...messages, newChatUser])

    setTimeout(() => {
      const responseTimestamp = new Date().toISOString()
      const newChatBot = {
        id: messages.length + 2,
        sender: 'Bot',
        message: generateResponse(message),
        timestamp: responseTimestamp,
      }
      setMessages([...messages, newChatBot])
    }, 1000)
  }

  const generateResponse = (question) => {
    if (question.toLowerCase().includes('how are you')) {
      return "I'm just a bot, but thanks for asking!"
    } else if (question.toLowerCase().includes('what is your name')) {
      return "I'm just a bot, I don't have a name!"
    } else if (question.toLowerCase().includes('hobbies')) {
      return "I'm a bot, so I don't have hobbies, but I enjoy helping users like you!"
    } else if (question.toLowerCase().includes('joke')) {
      return "Why don't scientists trust atoms? Because they make up everything!"
    } else if (question.toLowerCase().includes('favorite color')) {
      return "I don't have eyes to see colors, but I'd say code blue!"
    } else {
      return "I'm sorry, I didn't understand your question."
    }
  }

  const clearChat = () => {
    localStorage.removeItem('chatMessages')
    setMessages([])
  }

  const handleQuestionClick = (question) => {
    handleSendMessage(question)
    setNewMessage('')
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((chat) => (
          <div
            key={chat.id}
            className={`message ${
              chat.sender === 'User' ? 'sent' : 'received'
            }`}
          >
            <p
              className={
                chat.sender === 'User' ? 'user-message' : 'bot-message'
              }
            >
              <strong>{chat.sender}</strong>: {chat.message}
            </p>
          </div>
        ))}
      </div>
      <div className="bottom-bar">
        <div className="question-chips">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="question-chip"
            >
              {question}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your question..."
        />
        <button onClick={() => handleSendMessage(newMessage)}>Send</button>
        <button onClick={clearChat}>Clear</button>
      </div>
    </div>
  )
}

export default Chat
