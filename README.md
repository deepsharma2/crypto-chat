# 🪙 Conversational Crypto Web-Chat

A mobile-friendly React-based crypto chatbot that fetches real-time market data, tracks your holdings, speaks responses aloud, and features a sleek chat UI. Built using Vite + Tailwind CSS + CoinGecko API.

---

## ✨ Features

- 💬 Chat interface with speech-enabled replies
- 📈 Real-time crypto prices (e.g., “What’s ETH trading at?”)
- 🔥 Today’s trending coins
- 📊 Basic coin stats (symbol, market cap, 24h change, description)
- 💼 Portfolio tracker (e.g., “I have 2 ETH”)
- 🪄 Smooth scrolling and bubble UI with timestamps
- 📉 Placeholder for 7-day chart rendering (extendable)
- 🧠 “Thinking…” indicator while data loads
- 🛡️ Graceful error handling if API rate-limits

---

## 🖼️ Screenshot

> Coming soon — or run it locally to view live!

---

## 🚀 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Lucide React](https://lucide.dev/) icons
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

---

## 🛠️ Setup & Run

```bash
# 1. Clone this repo
git clone https://github.com/yourusername/crypto-chat.git
cd crypto-chat

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

Then open your browser at:
👉 http://localhost:5173

🧪 Example Commands to Try
What's BTC trading at right now?

Give me ETH stats

Show trending coins

I have 2 ETH

What's my portfolio worth?

Show chart of DOGE (chart coming soon)

📦 Folder Structure
pgsql
Copy
Edit
crypto-chat/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
🔒 API Info
This project uses the free public CoinGecko API which has a rate limit. If you hit the limit, you'll see a friendly fallback error.

No API key is required!

📢 To-Do / Enhancements
 Voice input (speech-to-text)

 7-day price chart using Recharts

 Save portfolio in localStorage

 Dark mode toggle

 PWA support