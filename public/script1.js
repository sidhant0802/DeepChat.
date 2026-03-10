
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

function showError(msg){
  hideAlerts();
  document.getElementById('alert-error-msg').textContent=msg;
  document.getElementById('alert-error').classList.add('show');
  setTimeout(()=>document.getElementById('alert-error').classList.remove('show'),5000);
}
function showSuccess(msg){
  hideAlerts();
  document.getElementById('alert-success-msg').textContent=msg;
  document.getElementById('alert-success').classList.add('show');
}
function hideAlerts(){
  document.getElementById('alert-error').classList.remove('show');
  document.getElementById('alert-success').classList.remove('show');
}

function fieldErr(id,show){ document.getElementById(id).classList.toggle('show',show); }

function setLoading(btnId,on){
  const b=document.getElementById(btnId);
  b.classList.toggle('loading',on); b.disabled=on;
}

const isEmail    = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isUsername = u => /^[a-zA-Z0-9_]{3,20}$/.test(u);


function switchTab(tab){
  hideAlerts();
  const tabs=['login','signup'];
  tabs.forEach((t,i)=>{
    document.querySelectorAll('.tab-btn')[i].classList.toggle('active', t===tab);
  });
  document.querySelectorAll('.form-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('panel-'+tab);
  if(panel) panel.classList.add('active');
  const tabRow=document.getElementById('tab-row');
  tabRow.style.opacity = tab==='forgot' ? '0.4' : '1';
  tabRow.style.pointerEvents = tab==='forgot' ? 'none' : 'all';
}

function toggleEye(id,btn){
  const inp=document.getElementById(id);
  const show=inp.type==='text';
  inp.type=show?'password':'text';
  btn.innerHTML=show
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

function checkStrength(val){
  const wrap=document.getElementById('strength-wrap');
  const fill=document.getElementById('strength-fill');
  const label=document.getElementById('strength-label');
  if(!val){ wrap.classList.remove('show'); return; }
  wrap.classList.add('show');
  let score=0;
  if(val.length>=8) score++;
  if(/[A-Z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  const levels=[
    {pct:'25%',color:'#ef4444',text:'Weak'},
    {pct:'50%',color:'#f97316',text:'Fair'},
    {pct:'75%',color:'#eab308',text:'Good'},
    {pct:'100%',color:'#22c55e',text:'Strong'}
  ];
  const l=levels[score-1]||levels[0];
  fill.style.width=l.pct; fill.style.background=l.color;
  label.textContent=l.text; label.style.color=l.color;
}

function showUserPanel(user){
  document.getElementById('auth-body').style.display='none';
  document.getElementById('tab-row').style.display='none';
  document.getElementById('user-panel').classList.add('active');
  const initials=user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('user-av-lg').textContent=initials;
  document.getElementById('user-welcome-title').textContent='Hey, '+user.name.split(' ')[0]+'! 👋';
  document.getElementById('user-username-display').textContent='@'+user.username;
  document.getElementById('user-email-display').textContent=user.email;
}

async function doLogin(){
  hideAlerts();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  let ok=true;
  if(!isEmail(email)){ fieldErr('login-email-err',true); ok=false; } 
  else fieldErr('login-email-err',false);

  if(!password){ fieldErr('login-pass-err',true); ok=false; } 
  else fieldErr('login-pass-err',false);

  if(!ok) return;

  setLoading('login-btn',true);

  try{

    const res = await fetch('/api/auth?action=login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body:JSON.stringify({email,password})
    });

    const data = await res.json();

    if(!res.ok){
      showError(data.error || 'Login failed. Please try again.');
      return;
    }

    window.location.href = "/index.html";

  } catch {
    showError('Cannot reach server. Make sure it is running.');
  } finally {
    setLoading('login-btn',false);
  }
}

async function doSignup(){
  hideAlerts();
  const name     = document.getElementById('signup-name').value.trim();
  const username = document.getElementById('signup-username').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  let ok=true;

  if(name.length<2)        { fieldErr('signup-name-err',true);    ok=false; } else fieldErr('signup-name-err',false);
  if(!isUsername(username)) { fieldErr('signup-username-err',true); ok=false; } else fieldErr('signup-username-err',false);
  if(!isEmail(email))      { fieldErr('signup-email-err',true);   ok=false; } else fieldErr('signup-email-err',false);
  if(password.length<8)    { fieldErr('signup-pass-err',true);    ok=false; } else fieldErr('signup-pass-err',false);
  if(password!==confirm)   { fieldErr('signup-confirm-err',true); ok=false; } else fieldErr('signup-confirm-err',false);
  if(!ok) return;

  setLoading('signup-btn',true);
  try{
    const res = await fetch('/api/auth?action=signup',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body:JSON.stringify({name,username,email,password})
    });
    const data = await res.json();
    if(!res.ok){ showError(data.error||'Signup failed. Please try again.'); return; }
    window.location.href = "/index.html";
    showToast('Account created! Welcome to DeepChat 🎉');
  } catch {
    showError('Cannot reach server. Make sure it is running.');
  } finally {
    setLoading('signup-btn',false);
  }
}

async function doForgot(){
  const email=document.getElementById('forgot-email').value.trim();
  if(!isEmail(email)){ fieldErr('forgot-email-err',true); return; }
  fieldErr('forgot-email-err',false);
  setLoading('forgot-btn',true);
  try{
    await new Promise(r=>setTimeout(r,900));
    showSuccess('Reset link sent! Check your inbox 📬');
    showToast('Email sent to '+email);
  } finally {
    setLoading('forgot-btn',false);
  }
}

async function doLogout(){
  try{ await fetch('/api/auth?action=logout',{method:'POST',credentials:'include'}); } catch{}
  document.getElementById('auth-body').style.display='block';
  document.getElementById('tab-row').style.display='flex';
  document.getElementById('tab-row').style.opacity='1';
  document.getElementById('tab-row').style.pointerEvents='all';
  document.getElementById('user-panel').classList.remove('active');
  document.getElementById('login-email').value='';
  document.getElementById('login-password').value='';
  switchTab('login');
  showToast('Signed out successfully');
}

function socialLogin(provider){ showToast(provider+' login coming soon!'); }

(async function checkSession(){
  try{
    const res=await fetch('/api/auth?action=me',{credentials:'include'});
    if(res.ok){
      const {user}=await res.json();
      showUserPanel(user);
    }
  } catch{}
})();

document.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return;
  const active=document.querySelector('.form-panel.active');
  if(!active) return;
  if(active.id==='panel-login')  doLogin();
  if(active.id==='panel-signup') doSignup();
  if(active.id==='panel-forgot') doForgot();
});