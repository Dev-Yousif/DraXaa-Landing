"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ChatWidget() {
  const locale = useLocale();
  const t = useTranslations('Chat');
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: t('greeting'),
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  // Enable audio on first user interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const enableAudio = () => {
      if (!audioReady) {
        // Create and prime audio context
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/notfication.wav');
          audioRef.current.volume = 0.5;
        }

        // Try to play silently to unlock audio
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioReady(true);
          }).catch(() => {
            // Audio not ready yet, will try again
          });
        }
      }
    };

    // Listen for any user interaction to enable audio
    const events = ['click', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, enableAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudio);
      });
    };
  }, [audioReady]);

  useEffect(() => {
    setIsMounted(true);

    // Preload audio
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/sounds/notfication.wav');
      audioRef.current.volume = 0.5;
      audioRef.current.load();
    }

    // Show welcome message after 10 seconds
    const timer = setTimeout(() => {
      setShowWelcome(true);

      // Play notification sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log('Audio play failed:', e);
            // Fallback: try creating new audio instance
            try {
              const fallbackAudio = new Audio('/sounds/notfication.wav');
              fallbackAudio.volume = 0.5;
              fallbackAudio.play().catch(err => console.log('Fallback audio failed:', err));
            } catch (err) {
              console.log('Fallback audio initialization failed:', err);
            }
          });
        }
      }
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          locale: locale,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <style jsx>{`
        .chat-messages::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-full max-w-[calc(100vw-2rem)] md:max-w-none md:w-auto" dir="ltr">
      {/* Chat Window */}
      <div
        className={`w-full md:w-[380px] h-[calc(100vh-8rem)] md:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right mb-16 md:mb-20 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-4 pointer-events-none"
        }`}
      >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                  D
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">{t('header')}</h3>
                <p className="text-xs text-white/80">{t('subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-messages"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} gap-2`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                  <span
                    className={`text-xs mt-1 block ${
                      message.role === "user" ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Show Contact Button outside message bubble if AI mentions contact/email */}
                {message.role === "assistant" &&
                 (message.content.includes("hello@draxaa.com") ||
                  message.content.includes("contact") ||
                  message.content.includes("/contact") ||
                  message.content.includes("اتصل") ||
                  message.content.includes("تواصل")) && (
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </Link>
                )}
              </div>
            ))}

            {/* Quick Questions - Show only if user hasn't sent any message yet */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    const question = t('quickQuestion1');
                    const userMessage = {
                      role: "user",
                      content: question,
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, userMessage]);
                    setIsLoading(true);

                    try {
                      const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: question,
                          locale: locale,
                          history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
                        }),
                      });

                      if (!response.ok) throw new Error("Failed to get response");
                      const data = await response.json();
                      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date() }]);
                    } catch (error) {
                      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later.", timestamp: new Date() }]);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-colors text-sm"
                >
                  {t('quickQuestion1')}
                </button>
                <button
                  onClick={async () => {
                    const question = t('quickQuestion2');
                    const userMessage = {
                      role: "user",
                      content: question,
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, userMessage]);
                    setIsLoading(true);

                    try {
                      const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: question,
                          locale: locale,
                          history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
                        }),
                      });

                      if (!response.ok) throw new Error("Failed to get response");
                      const data = await response.json();
                      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date() }]);
                    } catch (error) {
                      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later.", timestamp: new Date() }]);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-colors text-sm"
                >
                  {t('quickQuestion2')}
                </button>
                <button
                  onClick={async () => {
                    const question = t('quickQuestion3');
                    const userMessage = {
                      role: "user",
                      content: question,
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, userMessage]);
                    setIsLoading(true);

                    try {
                      const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: question,
                          locale: locale,
                          history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
                        }),
                      });

                      if (!response.ok) throw new Error("Failed to get response");
                      const data = await response.json();
                      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date() }]);
                    } catch (error) {
                      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later.", timestamp: new Date() }]);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-colors text-sm"
                >
                  {t('quickQuestion3')}
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('placeholder')}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
                  rows="1"
                  style={{ maxHeight: "120px" }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-primary text-white p-2.5 md:p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

      {/* Floating Button and Welcome Bubble */}
      <div className="absolute bottom-0 right-0 flex items-center gap-2 md:gap-3">
        {!isOpen && showWelcome && (
          <div
            className="hidden md:block bg-white rounded-lg shadow-lg px-4 py-2 animate-in slide-in-from-right-4"
            dir="ltr"
          >
            <p className="text-sm text-gray-800 font-medium whitespace-nowrap" dir="ltr">{t('welcomeMessage')}</p>
            <p className="text-xs text-gray-600" dir="ltr">{t('welcomeSubtitle')}</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 relative"
        >
          {/* Green notification dot */}
          {showWelcome && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
            </span>
          )}

          <svg
            className="w-6 h-6 transition-all duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0deg) scale(1)' }}
          >
            {!isOpen ? (
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
            ) : (
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            )}
          </svg>
        </button>
      </div>
    </div>
    </>
  );
}
