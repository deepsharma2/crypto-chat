import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'recharts';
import { Mic, Send } from 'lucide-react';

const API_BASE = 'https://api.coingecko.com/api/v3';

export default function CryptoChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [portfolio, setPortfolio] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };

  const handleMessage = async (text) => {
    if (!text.trim()) return;
    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    setThinking(true);

    let response = '';
    try {
      if (/\bprice of (\w+)/i.test(text) || /what.*\b(\w+).*trading/i.test(text)) {
        const coin = text.match(/\bprice of (\w+)/i)?.[1] || text.match(/what.*\b(\w+).*trading/i)?.[1];
        const res = await fetch(`${API_BASE}/simple/price?ids=${coin.toLowerCase()}&vs_currencies=usd`);
        const data = await res.json();
        response = data[coin.toLowerCase()]?.usd
          ? `${coin.toUpperCase()} is trading at $${data[coin.toLowerCase()].usd}`
          : `Couldn't find price for ${coin}`;
      } else if (/trending/i.test(text)) {
        const res = await fetch(`${API_BASE}/search/trending`);
        const data = await res.json();
        response = 'Trending coins: ' + data.coins.map((c) => c.item.name).join(', ');
      } else if (/\b(stats|details)\b.*(\w+)/i.test(text)) {
        const coin = text.match(/\b(stats|details)\b.*(\w+)/i)?.[2];
        const res = await fetch(`${API_BASE}/coins/${coin.toLowerCase()}`);
        const data = await res.json();
        response = `${data.name} (${data.symbol.toUpperCase()}) - Market Cap: $${data.market_data.market_cap.usd}, 24h Change: ${data.market_data.price_change_percentage_24h.toFixed(2)}%, ${data.description.en?.split('.')[0]}`;
      } else if (/i have (\d+\.?\d*) (\w+)/i.test(text)) {
        const [, qty, coin] = text.match(/i have (\d+\.?\d*) (\w+)/i);
        setPortfolio((p) => ({ ...p, [coin.toLowerCase()]: parseFloat(qty) }));
        response = `Noted! You have ${qty} ${coin.toUpperCase()}`;
      } else if (/portfolio/i.test(text)) {
        let total = 0;
        let portfolioSummary = [];
        for (const coin in portfolio) {
          const res = await fetch(`${API_BASE}/simple/price?ids=${coin}&vs_currencies=usd`);
          const data = await res.json();
          const value = portfolio[coin] * (data[coin]?.usd || 0);
          total += value;
          portfolioSummary.push(`${coin.toUpperCase()}: $${value.toFixed(2)}`);
        }
        response = `Your portfolio value is $${total.toFixed(2)}\n` + portfolioSummary.join(', ');
      } else if (/chart.*(\w+)/i.test(text)) {
        const coin = text.match(/chart.*(\w+)/i)[1];
        response = `Chart feature coming soon for ${coin.toUpperCase()}.`;
      } else {
        response = "I'm not sure how to help with that.";
      }
    } catch (err) {
      response = 'Oops! Hit an API error or rate limit.';
    }

    setThinking(false);
    setMessages((msgs) => [...msgs, { from: 'bot', text: response }]);
    speak(response);
  };

  return (
    <div className="crypto-bss-root">
      <header className="crypto-bss-header">
        <img src="https://cdn1.iconfinder.com/data/icons/cryptocurrency-set-2018/375/Asset_1480-512.png" alt="Crypto" className="crypto-bss-logo" />
        <h1 className="crypto-bss-title">Crypto Chat</h1>
      </header>
      <main className="crypto-bss-main">
        <div className="crypto-bss-chatbox">
          <div className="crypto-bss-messages custom-scrollbar">
            {messages.length === 0 && (
              <div className="crypto-bss-empty">
                <span className="crypto-bss-empty-icon">💬</span>
                <div className="crypto-bss-empty-text">Ask me about crypto prices, stats, or your portfolio!</div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`crypto-bss-row ${m.from === 'user' ? 'crypto-bss-row-user' : 'crypto-bss-row-bot'}`}
              >
                <div
                  className={`crypto-bss-bubble ${m.from === 'user' ? 'crypto-bss-bubble-user' : 'crypto-bss-bubble-bot'}`}
                >
                  <div className="crypto-bss-bubble-text">{m.text}</div>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="crypto-bss-row crypto-bss-row-bot">
                <div className="crypto-bss-bubble crypto-bss-bubble-bot crypto-bss-bubble-thinking">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="crypto-bss-inputbar">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (handleMessage(input), setInput(''))}
              placeholder="Ask me about crypto..."
              className="crypto-bss-input"
            />
            <button
              onClick={() => { handleMessage(input); setInput(''); }}
              className="crypto-bss-send"
              disabled={!input.trim() || thinking}
              aria-label="Send"
            >
              <Send className="crypto-bss-send-icon" />
            </button>
            <button
              className="crypto-bss-mic"
              title="Voice input (coming soon)"
              disabled
            >
              <Mic className="crypto-bss-mic-icon" />
            </button>
          </div>
        </div>
        <footer className="crypto-bss-footer">
          Powered by CoinGecko API
        </footer>
      </main>
      <style>{`
        .crypto-bss-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0e7ff 0%, #fff 60%, #f3e8ff 100%);
          display: flex;
          flex-direction: column;
        }
        .crypto-bss-header {
          padding: 28px 24px 20px 24px;
          background: #fff;
          box-shadow: 0 2px 12px 0 rgba(80, 80, 180, 0.06);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .crypto-bss-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px 0 rgba(255, 183, 0, 0.12);
        }
        .crypto-bss-title {
          font-size: 2rem;
          font-weight: 700;
          color: #3b3b7c;
          letter-spacing: -1px;
        }
        .crypto-bss-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .crypto-bss-chatbox {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: rgba(255,255,255,0.92);
          border-radius: 2.5rem;
          box-shadow: 0 8px 32px 0 rgba(80, 80, 180, 0.10);
          margin-top: 32px;
          margin-bottom: 16px;
          overflow: hidden;
          border: 1.5px solid #e5e7eb;
        }
        .crypto-bss-messages {
          flex: 1;
          overflow-y: auto;
          padding: 28px 28px 8px 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 320px;
          max-height: 420px;
        }
        .crypto-bss-row {
          display: flex;
        }
        .crypto-bss-row-user {
          justify-content: flex-end;
        }
        .crypto-bss-row-bot {
          justify-content: flex-start;
        }
        .crypto-bss-bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 1.5rem;
          font-size: 1rem;
          box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.07);
          transition: background 0.2s;
          word-break: break-word;
          line-height: 1.6;
        }
        .crypto-bss-bubble-user {
          background: linear-gradient(135deg, #4f8cff 0%, #6d5dfc 100%);
          color: #fff;
          border-bottom-right-radius: 0.5rem;
        }
        .crypto-bss-bubble-bot {
          background: #f5f7fa;
          color: #3b3b7c;
          border-bottom-left-radius: 0.5rem;
        }
        .crypto-bss-bubble-thinking {
          color: #a0aec0;
          background: #f5f7fa;
          animation: crypto-bss-pulse 1.2s infinite;
        }
        @keyframes crypto-bss-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .crypto-bss-bubble-text {
          white-space: pre-line;
        }
        .crypto-bss-empty {
          text-align: center;
          color: #b0b6c7;
          padding: 60px 0 40px 0;
        }
        .crypto-bss-empty-icon {
          font-size: 2.5rem;
        }
        .crypto-bss-empty-text {
          margin-top: 10px;
          font-size: 1.1rem;
        }
        .crypto-bss-inputbar {
          border-top: 1.5px solid #e5e7eb;
          background: rgba(255,255,255,0.98);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .crypto-bss-input {
          flex: 1;
          padding: 13px 18px;
          border: 1.5px solid #d1d5db;
          border-radius: 1.5rem;
          outline: none;
          font-size: 1rem;
          background: #f7fafc;
          color: #3b3b7c;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .crypto-bss-input:focus {
          border-color: #6d5dfc;
          box-shadow: 0 0 0 2px #e0e7ff;
        }
        .crypto-bss-send {
          padding: 13px;
          background: linear-gradient(135deg, #4f8cff 0%, #6d5dfc 100%);
          color: #fff;
          border: none;
          border-radius: 1.5rem;
          box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.10);
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .crypto-bss-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .crypto-bss-send-icon {
          width: 22px;
          height: 22px;
        }
        .crypto-bss-mic {
          padding: 13px;
          background: #f7fafc;
          border: 1.5px solid #d1d5db;
          border-radius: 1.5rem;
          color: #b0b6c7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
        }
        .crypto-bss-mic-icon {
          width: 22px;
          height: 22px;
        }
        .crypto-bss-footer {
          font-size: 0.85rem;
          color: #b0b6c7;
          margin-top: 10px;
          margin-bottom: 24px;
          text-align: center;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ef;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
