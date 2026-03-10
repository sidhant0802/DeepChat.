// // this calls your server which then calls llm.js
// const SERVER_URL = "/api/chat";

// const state = { loading: false };

// document.getElementById('init-ts').textContent = getTime();

// const msgEl = document.getElementById('msg');

// msgEl.addEventListener('input', () => {
//   msgEl.style.height = 'auto';
//   msgEl.style.height = Math.min(msgEl.scrollHeight, 110) + 'px';
// });

// msgEl.addEventListener('keydown', e => {
//   if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
// });

// function useChip(el) {
//   msgEl.value = el.textContent;
//   msgEl.dispatchEvent(new Event('input'));
//   msgEl.focus();
// }

// function getTime() {
//   return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// function showToast(msg) {
//   const t = document.getElementById('toast');
//   t.textContent = msg;
//   t.classList.add('show');
//   setTimeout(() => t.classList.remove('show'), 2800);
// }

// function scrollBottom() {
//   const c = document.getElementById('msgs');
//   c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
// }

// const BOT_AV = `<div class="av-bot">
//   <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
//        stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
//     <rect x="3" y="11" width="18" height="10" rx="3"/>
//     <path d="M9 11V8a3 3 0 0 1 6 0v3"/>
//     <circle cx="9" cy="16" r="1" fill="white" stroke="none"/>
//     <circle cx="15" cy="16" r="1" fill="white" stroke="none"/>
//   </svg>
// </div>`;

// function formatText(text) {
//   text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//   text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(37,99,235,0.08);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.8rem;">$1</code>');

//   let out = '';
//   const lines = text.split('\n');
//   let inList = false;

//   lines.forEach(line => {
//     const t = line.trim();
//     if (t.match(/^[-•*]\s+/) || t.match(/^\d+\.\s+/)) {
//       if (!inList) { out += '<ul>'; inList = true; }
//       out += `<li>${t.replace(/^[-•*]\s+|^\d+\.\s+/, '')}</li>`;
//     } else {
//       if (inList) { out += '</ul>'; inList = false; }
//       if (t) out += `<p style="margin-bottom:4px">${t}</p>`;
//     }
//   });

//   if (inList) out += '</ul>';
//   return out || `<p>${text}</p>`;
// }

// function appendBot(text, isNew = true) {
//   const c = document.getElementById('msgs');
//   const row = document.createElement('div');
//   row.className = 'row bot';
//   row.innerHTML = `${BOT_AV}
//     <div class="bubble-wrap">
//       <div class="bubble${isNew ? ' new' : ''}">${formatText(text)}</div>
//       <div class="ts">${getTime()}</div>
//     </div>`;
//   c.appendChild(row);
//   scrollBottom();
// }

// function appendUser(text) {
//   const c = document.getElementById('msgs');
//   const row = document.createElement('div');
//   row.className = 'row user';
//   row.innerHTML = `<div class="bubble-wrap">
//       <div class="bubble">${text.replace(/\n/g, '<br>')}</div>
//       <div class="ts">${getTime()}</div>
//     </div>`;
//   c.appendChild(row);
//   scrollBottom();
// }

// function showTyping() {
//   const c = document.getElementById('msgs');
//   const row = document.createElement('div');
//   row.className = 'typing-row'; row.id = 'typing-row';
//   row.innerHTML = `${BOT_AV}
//     <div class="typing-bub"><span></span><span></span><span></span></div>`;
//   c.appendChild(row);
//   scrollBottom();
// }

// function hideTyping() {
//   const r = document.getElementById('typing-row');
//   if (r) r.remove();
// }

// function clearChat() {
//   const c = document.getElementById('msgs');
//   c.innerHTML = `<div class="date-sep">Today</div>
//     <div class="row bot">
//       ${BOT_AV}
//       <div class="bubble-wrap">
//         <div class="bubble">Hello! I'm <strong>DeepChat</strong>, your AI assistant. How can I help you today? 👋</div>
//         <div class="ts">${getTime()}</div>
//       </div>
//     </div>`;
//   showToast('Conversation cleared ✓');
// }

// async function sendMsg() {
//   const text = msgEl.value.trim();
//   if (!text || state.loading) return;

//   msgEl.value = '';
//   msgEl.style.height = 'auto';
//   document.getElementById('send-btn').disabled = true;
//   state.loading = true;

//   appendUser(text);
//   showTyping();

//   try {
//     const res = await fetch(SERVER_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',   // ✅ FIXED: sends JWT cookie for auth
//       body: JSON.stringify({ message: text })
//     });

//     // If 401, session expired — redirect to login
//     if (res.status === 401) {
//       hideTyping();
//       appendBot('⚠️ Your session expired. Redirecting to login…');
//       setTimeout(() => window.location.href = '/auth.html', 1800);
//       return;
//     }

//     if (!res.ok) {
//       const e = await res.json().catch(() => ({}));
//       throw new Error(e?.error || `Server error ${res.status}`);
//     }

//     const data = await res.json();
//     const reply = data.reply;

//     hideTyping();
//     appendBot(reply);

//   } catch (err) {
//     hideTyping();
//     if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
//       appendBot('⚠️ Server connection error. Please try again.');
//     } else {
//       appendBot(`⚠️ ${err.message}`);
//     }
//   } finally {
//     state.loading = false;
//     document.getElementById('send-btn').disabled = false;
//     msgEl.focus();
//   }
// }

// // ── Voice input
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// let recognition = null;
// let isRecording = false;

// if (SpeechRecognition) {
//   recognition = new SpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = true;
//   recognition.lang = 'en-US';

//   let finalTranscript = '';

//   recognition.onstart = () => {
//     isRecording = true;
//     finalTranscript = '';
//     document.getElementById('mic-btn').classList.add('recording');
//     document.getElementById('voice-bar').classList.add('active');
//   };













// this calls your server which then calls llm.js
const SERVER_URL = "/api/chat";

const state = { loading: false };

document.getElementById('init-ts').textContent = getTime();

const msgEl = document.getElementById('msg');

msgEl.addEventListener('input', () => {
  msgEl.style.height = 'auto';
  msgEl.style.height = Math.min(msgEl.scrollHeight, 110) + 'px';
});

msgEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});

function useChip(el) {
  msgEl.value = el.textContent;
  msgEl.dispatchEvent(new Event('input'));
  msgEl.focus();
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function scrollBottom() {
  const c = document.getElementById('msgs');
  c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
}

const BOT_AV = `<div class="av-bot">
  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
    <rect x="3" y="11" width="18" height="10" rx="3"/>
    <path d="M9 11V8a3 3 0 0 1 6 0v3"/>
    <circle cx="9" cy="16" r="1" fill="white" stroke="none"/>
    <circle cx="15" cy="16" r="1" fill="white" stroke="none"/>
  </svg>
</div>`;

function formatText(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(37,99,235,0.08);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.8rem;">$1</code>');

  let out = '';
  const lines = text.split('\n');
  let inList = false;

  lines.forEach(line => {
    const t = line.trim();
    if (t.match(/^[-•*]\s+/) || t.match(/^\d+\.\s+/)) {
      if (!inList) { out += '<ul>'; inList = true; }
      out += `<li>${t.replace(/^[-•*]\s+|^\d+\.\s+/, '')}</li>`;
    } else {
      if (inList) { out += '</ul>'; inList = false; }
      if (t) out += `<p style="margin-bottom:4px">${t}</p>`;
    }
  });

  if (inList) out += '</ul>';
  return out || `<p>${text}</p>`;
}

function appendBot(text, isNew = true) {
  const c = document.getElementById('msgs');
  const row = document.createElement('div');
  row.className = 'row bot';
  row.innerHTML = `${BOT_AV}
    <div class="bubble-wrap">
      <div class="bubble${isNew ? ' new' : ''}">${formatText(text)}</div>
      <div class="ts">${getTime()}</div>
    </div>`;
  c.appendChild(row);
  scrollBottom();
}

function appendUser(text) {
  const c = document.getElementById('msgs');
  const row = document.createElement('div');
  row.className = 'row user';
  row.innerHTML = `<div class="bubble-wrap">
      <div class="bubble">${text.replace(/\n/g, '<br>')}</div>
      <div class="ts">${getTime()}</div>
    </div>`;
  c.appendChild(row);
  scrollBottom();
}

function showTyping() {
  const c = document.getElementById('msgs');
  const row = document.createElement('div');
  row.className = 'typing-row'; row.id = 'typing-row';
  row.innerHTML = `${BOT_AV}
    <div class="typing-bub"><span></span><span></span><span></span></div>`;
  c.appendChild(row);
  scrollBottom();
}

function hideTyping() {
  const r = document.getElementById('typing-row');
  if (r) r.remove();
}

function clearChat() {
  const c = document.getElementById('msgs');
  c.innerHTML = `<div class="date-sep">Today</div>
    <div class="row bot">
      ${BOT_AV}
      <div class="bubble-wrap">
        <div class="bubble">Hello! I'm <strong>DeepChat</strong>, your AI assistant. How can I help you today? 👋</div>
        <div class="ts">${getTime()}</div>
      </div>
    </div>`;
  showToast('Conversation cleared ✓');
}

async function sendMsg() {
  const text = msgEl.value.trim();
  if (!text || state.loading) return;

  msgEl.value = '';
  msgEl.style.height = 'auto';
  document.getElementById('send-btn').disabled = true;
  state.loading = true;

  appendUser(text);
  showTyping();

  try {
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ✅ FIXED: sends JWT cookie for auth
      body: JSON.stringify({ message: text })
    });

    // If 401, session expired — redirect to login
    if (res.status === 401) {
      hideTyping();
      appendBot('⚠️ Your session expired. Redirecting to login…');
      setTimeout(() => window.location.href = '/auth.html', 1800);
      return;
    }

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error || `Server error ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply;

    hideTyping();
    appendBot(reply);

  } catch (err) {
    hideTyping();
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      appendBot('⚠️ Server connection error. Please try again.');
    } else {
      appendBot(`⚠️ ${err.message}`);
    }
  } finally {
    state.loading = false;
    document.getElementById('send-btn').disabled = false;
    msgEl.focus();
  }
}

// ── Voice input
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let finalTranscript = '';

  recognition.onstart = () => {
    isRecording = true;
    finalTranscript = '';
    document.getElementById('mic-btn').classList.add('recording');
    document.getElementById('voice-bar').classList.add('active');
  };

  recognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i].transcript;
      if (e.results[i].isFinal) { finalTranscript += t + ' '; }
      else { interim += t; }
    }
    msgEl.value = (finalTranscript + interim).trim();
    msgEl.dispatchEvent(new Event('input'));
  };

  recognition.onend = () => {
    isRecording = false;
    document.getElementById('mic-btn').classList.remove('recording');
    document.getElementById('voice-bar').classList.remove('active');
    if (msgEl.value.trim()) {
      msgEl.focus();
      showToast('Voice captured — press Send or edit ✓');
    }
  };

  recognition.onerror = (e) => {
    isRecording = false;
    document.getElementById('mic-btn').classList.remove('recording');
    document.getElementById('voice-bar').classList.remove('active');
    const msgs = {
      'not-allowed': 'Mic permission denied — allow it in browser settings.',
      'no-speech':   'No speech detected. Try again.',
      'network':     'Network error during voice input.'
    };
    showToast(msgs[e.error] || `Voice error: ${e.error}`);
  };
} else {
  document.getElementById('mic-btn').title = 'Voice input needs Chrome or Edge';
  document.getElementById('mic-btn').style.opacity = '.35';
  document.getElementById('mic-btn').style.cursor = 'not-allowed';
}

function toggleMic() {
  if (!recognition) { showToast('Use Chrome or Edge for voice input 🎤'); return; }
  if (isRecording) { stopMic(); }
  else { msgEl.value = ''; recognition.start(); }
}

function stopMic() {
  if (recognition && isRecording) recognition.stop();
}

async function loadHistory() {

  try {

    const res = await fetch("/api/history", {
      credentials: "include"
    });

    if (!res.ok) return;

    const messages = await res.json();

    messages.forEach(m => {

      if (m.role === "user") {
        appendUser(m.content);
      } else {
        appendBot(m.content, false);
      }

    });
  } catch (err) {
    console.error("History load error:", err);
  }

}

loadHistory();
fetch("/api/history")










// (function(){
//   const c=document.getElementById('particles');
//   for(let i=0;i<18;i++){
//     const p=document.createElement('div'); p.className='particle';
//     const s=Math.random()*60+20;
//     p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*20}s;opacity:${Math.random()*.4+.05};`;
//     c.appendChild(p);
//   }
// })();

(async function sessionGuard() {
  try {
    const res = await fetch('/api/auth?action=me', { credentials: 'include' });
    if (!res.ok) {
      window.location.replace('/auth.html');
      return;
    }
    const { user } = await res.json();
    populateHeader(user);
  } catch (err) {
    // Server totally unreachable (e.g. dev with no backend)
    // Comment out the line below if you want to allow offline dev:
    window.location.replace('/auth.html');
  }
})();

function populateHeader(user) {
  const firstName = (user.name || 'User').split(' ')[0];
  const initials  = (user.name || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  document.getElementById('hdr-av').textContent   = initials;
  document.getElementById('hdr-name').textContent = firstName;

  document.getElementById('dd-av').textContent    = initials;
  document.getElementById('dd-name').textContent  = user.name  || '—';
  document.getElementById('dd-email').textContent = user.email || '—';

  const greet = document.getElementById('greeting-bubble');
  if (greet) {
    greet.innerHTML =
      `Hello <strong>${firstName}</strong>! I'm <strong>DeepChat</strong>, ` +
      `your AI assistant. How can I help you today? 👋`;
  }
}

function toggleDropdown() {
  const menu = document.getElementById('user-dropdown');
  menu.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("user-badge");

  if (badge) {
    badge.addEventListener("click", toggleDropdown);
  }

  document.addEventListener("click", (e) => {
    const wrap = document.getElementById("user-menu-wrap");
    const menu = document.getElementById("user-dropdown");

    if (wrap && !wrap.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
});

async function doLogout() {
  try {
    await fetch('/api/auth?action=logout', { method: 'POST', credentials: 'include' });
  } catch {}
  window.location.replace('/auth.html');
}


function goProfile() {
  document.getElementById('user-dropdown').classList.remove('open');
  window.location.href = '/auth.html';
}
