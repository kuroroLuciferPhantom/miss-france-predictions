import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';

const Chat = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuthContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    let date;
    
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    // Formater la date
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();

    const time = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });

    if (isToday) {
      return `Aujourd'hui à ${time}`;
    } else if (isYesterday) {
      return `Hier à ${time}`;
    } else {
      return `${date.toLocaleDateString('fr-FR')} à ${time}`;
    }
  };

  const isConsecutiveMessage = (message, index) => {
    if (index === 0) return false;
    const prevMessage = messages[index - 1];
    
    // Même utilisateur
    const sameUser = prevMessage.userId === message.userId;
    
    // Vérifier si les messages sont dans un intervalle de 2 minutes
    const currentTime = message.timestamp?.toDate?.() || new Date(message.timestamp);
    const prevTime = prevMessage.timestamp?.toDate?.() || new Date(prevMessage.timestamp);
    const timeDiff = Math.abs(currentTime - prevTime);
    const withinTimeframe = timeDiff < 2 * 60 * 1000; // 2 minutes en millisecondes
  
    return sameUser && withinTimeframe;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat du groupe</h2>
      </div>
  
      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.userId === user.uid;
            const isConsecutive = isConsecutiveMessage(message, index);
  
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                  {!isConsecutive && (
                    <div className={`flex items-baseline space-x-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-sm font-medium ${
                        isCurrentUser 
                          ? 'text-pink-600 dark:text-pink-400' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {isCurrentUser ? 'Vous' : message.username}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg break-words ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
  
      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;