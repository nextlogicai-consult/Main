/* NextLogicAI Chat Widget — drop chatbot.js into your site and add the embed snippet */

(function () {
  const API_URL = "https://unwoven-poker-waltz.ngrok-free.dev/chat"; // ← replace after deploy

  const styles = `
    #nlai-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
      background: #0f172a; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #nlai-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.4); }
    #nlai-btn svg { width: 26px; height: 26px; }

    #nlai-window {
      position: fixed; bottom: 96px; right: 28px; z-index: 9998;
      width: 360px; max-height: 520px;
      background: #ffffff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'DM Sans', system-ui, sans-serif;
      transition: opacity 0.2s, transform 0.2s;
      opacity: 0; transform: translateY(12px) scale(0.97); pointer-events: none;
    }
    #nlai-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    #nlai-header {
      background: #0f172a; color: #fff; padding: 16px 18px;
      display: flex; align-items: center; gap: 10px;
    }
    #nlai-header .dot {
      width: 8px; height: 8px; border-radius: 50%; background: #22d3a5;
      box-shadow: 0 0 6px #22d3a5;
    }
    #nlai-header .title { font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
    #nlai-header .sub { font-size: 11px; opacity: 0.55; margin-left: auto; }

    #nlai-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      background: #f8fafc;
    }
    .nlai-msg {
      max-width: 82%; padding: 10px 13px; border-radius: 12px;
      font-size: 13.5px; line-height: 1.55; word-break: break-word;
    }
    .nlai-msg.bot {
      background: #fff; border: 1px solid #e2e8f0; color: #1e293b;
      border-bottom-left-radius: 3px; align-self: flex-start;
    }
    .nlai-msg.user {
      background: #0f172a; color: #fff;
      border-bottom-right-radius: 3px; align-self: flex-end;
    }
    .nlai-typing { display: flex; gap: 4px; align-items: center; padding: 10px 13px; }
    .nlai-typing span {
      width: 6px; height: 6px; background: #94a3b8; border-radius: 50%;
      animation: nlai-bounce 1.2s infinite ease-in-out;
    }
    .nlai-typing span:nth-child(2) { animation-delay: 0.2s; }
    .nlai-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes nlai-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }

    #nlai-input-row {
      display: flex; gap: 8px; padding: 12px 14px;
      background: #fff; border-top: 1px solid #e2e8f0;
    }
    #nlai-input {
      flex: 1; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 9px 12px; font-size: 13.5px; outline: none;
      font-family: inherit; resize: none; background: #f8fafc;
      transition: border-color 0.15s;
    }
    #nlai-input:focus { border-color: #0f172a; background: #fff; }
    #nlai-send {
      background: #0f172a; color: #fff; border: none; border-radius: 8px;
      padding: 0 14px; cursor: pointer; font-size: 18px;
      transition: background 0.15s;
    }
    #nlai-send:hover { background: #1e293b; }
    #nlai-send:disabled { background: #94a3b8; cursor: default; }

    @media (max-width: 420px) {
      #nlai-window { width: calc(100vw - 32px); right: 16px; bottom: 84px; }
      #nlai-btn { right: 16px; bottom: 16px; }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Button
  const btn = document.createElement("button");
  btn.id = "nlai-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#22d3a5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  // Window
  const win = document.createElement("div");
  win.id = "nlai-window";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", "NextLogicAI chat assistant");
  win.innerHTML = `
    <div id="nlai-header">
      <div class="dot"></div>
      <span class="title">NextLogicAI Assistant</span>
      <span class="sub">Mistral · Local AI</span>
    </div>
    <div id="nlai-messages"></div>
    <div id="nlai-input-row">
      <textarea id="nlai-input" placeholder="Ask me anything…" rows="1"></textarea>
      <button id="nlai-send" aria-label="Send">&#x27A4;</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  const msgs = document.getElementById("nlai-messages");
  const input = document.getElementById("nlai-input");
  const sendBtn = document.getElementById("nlai-send");

  let history = [];
  let isOpen = false;

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = `nlai-msg ${role}`;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "nlai-msg bot nlai-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    input.style.height = "auto";
    sendBtn.disabled = true;

    addMessage("user", text);
    history.push({ role: "user", content: text });

    const typing = showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Something went wrong.";
      typing.remove();
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });
    } catch {
      typing.remove();
      addMessage("bot", "Connection issue — please try again.");
    }

    sendBtn.disabled = false;
    input.focus();
  }

  // Greet on first open
  let greeted = false;
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(() => addMessage("bot", "Hi! I'm the NextLogicAI assistant. Ask me how AI can help your business, about our services, or pricing — I'm here to help."), 300);
    }
    if (isOpen) input.focus();
  });

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Auto-resize textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
  });
})();
