/* ============================================
   INNOVEXA HUB — Main Application
   ============================================ */
const App = {
  currentPage: 'login',
  currentUser: null,
  params: {},
  adminTab: 'members',
  eventTab: 'upcoming',
  eventFilter: 'all',
  resourceFilter: 'all',

  init() {
    this.currentUser = Store.getCurrentUser();
    if (this.currentUser) this.currentPage = 'dashboard';
    this.render();
    window.addEventListener('hashchange', () => {
      const page = location.hash.slice(1) || (this.currentUser ? 'dashboard' : 'login');
      this.navigate(page);
    });
  },

  navigate(page, params = {}) {
    if (!this.currentUser && page !== 'login') page = 'login';
    this.currentPage = page;
    this.params = params;
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const root = document.getElementById('root');
    if (this.currentPage === 'login') {
      root.innerHTML = this.renderLoginPage();
      this.bindLoginPage();
    } else {
      root.innerHTML = `
        <div class="app-layout">
          ${this.renderSidebar()}
          <div class="main-area">
            ${this.renderHeader()}
            <div class="page-content" id="page-content"></div>
          </div>
        </div>`;
      this.bindLayout();
      this.renderCurrentPage();
    }
  },

  renderCurrentPage() {
    const c = document.getElementById('page-content');
    if (!c) return;
    const pages = {
      dashboard: () => { c.innerHTML = this.renderDashboard(); this.bindDashboard(); },
      events: () => { c.innerHTML = this.renderEvents(); this.bindEvents(); },
      chat: () => { c.innerHTML = this.renderChat(); this.bindChat(); },
      profile: () => { c.innerHTML = this.renderProfile(); this.bindProfile(); },
      members: () => { c.innerHTML = this.renderMembers(); this.bindMembers(); },
      admin: () => { c.innerHTML = this.renderAdmin(); this.bindAdmin(); },
      leaderboard: () => { c.innerHTML = this.renderLeaderboard(); },
      resources: () => { c.innerHTML = this.renderResources(); this.bindResources(); },
    };
    (pages[this.currentPage] || pages.dashboard)();
  },

  // ===== UTILITIES =====
  getInitials(name) { return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); },
  getAvatarColor(name) {
    const colors = ['#8b5cf6','#06b6d4','#f59e0b','#10b981','#ef4444','#ec4899','#6366f1','#14b8a6'];
    let h = 0; for (let i = 0; i < (name||'').length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  },
  avatarHTML(name, cls = '') {
    return `<div class="avatar ${cls}" style="background:${this.getAvatarColor(name)}">${this.getInitials(name)}</div>`;
  },
  formatDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  formatTime(d) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },
  timeAgo(d) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s/60) + 'm ago';
    if (s < 86400) return Math.floor(s/3600) + 'h ago';
    return Math.floor(s/86400) + 'd ago';
  },
  getMonthDay(d) {
    const dt = new Date(d);
    return { month: dt.toLocaleString('en', {month:'short'}).toUpperCase(), day: dt.getDate() };
  },
  showToast(msg, type = 'info') {
    const tc = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: 'check_circle', error: 'error', info: 'info' };
    t.innerHTML = `<span class="material-symbols-rounded">${icons[type]||'info'}</span>${msg}`;
    tc.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(60px)'; setTimeout(() => t.remove(), 300); }, 3000);
  },
  showModal(html) {
    const mc = document.getElementById('modal-container');
    mc.innerHTML = `<div class="modal-overlay" id="modal-overlay"><div class="modal">${html}</div></div>`;
    document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target.id === 'modal-overlay') this.closeModal(); });
    const closeBtn = mc.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
  },
  closeModal() { document.getElementById('modal-container').innerHTML = ''; },

  // ===== SIDEBAR =====
  renderSidebar() {
    const items = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'events', icon: 'event', label: 'Events' },
      { id: 'chat', icon: 'chat', label: 'Chat' },
      { id: 'members', icon: 'group', label: 'Members' },
      { id: 'leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
      { id: 'resources', icon: 'library_books', label: 'Resources' },
      { id: 'profile', icon: 'person', label: 'My Profile' },
    ];
    if (this.currentUser?.role === 'admin') items.push({ id: 'admin', icon: 'admin_panel_settings', label: 'Admin Panel' });
    const u = this.currentUser;
    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon"><img src="assets/logo.png" alt="Innovexa Hub"></div>
          <div class="sidebar-logo-text"><h2>Innovexa Hub</h2><span>Members Portal</span></div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section"><div class="nav-section-label">Menu</div>
            ${items.map(i => `<button class="nav-item ${this.currentPage===i.id?'active':''}" data-page="${i.id}"><span class="material-symbols-rounded">${i.icon}</span>${i.label}</button>`).join('')}
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            ${this.avatarHTML(u?.name, 'avatar-sm')}
            <div class="sidebar-user-info"><div class="sidebar-user-name">${u?.name||''}</div><div class="sidebar-user-role">${u?.role||''}</div></div>
          </div>
          <button class="nav-item" id="logout-btn" style="margin-top:8px;color:var(--danger-light)"><span class="material-symbols-rounded">logout</span>Logout</button>
        </div>
      </aside>`;
  },

  // ===== HEADER =====
  renderHeader() {
    const titles = { dashboard:'Dashboard', events:'Events', chat:'Club Chat', profile:'My Profile', members:'Members', admin:'Admin Panel', leaderboard:'Leaderboard', resources:'Resources' };
    return `
      <header class="header">
        <div class="header-left">
          <button class="mobile-menu-btn" id="mobile-menu"><span class="material-symbols-rounded">menu</span></button>
          <h1 class="header-title">${titles[this.currentPage]||'Dashboard'}</h1>
        </div>
        <div class="header-right">${this.avatarHTML(this.currentUser?.name, 'avatar-sm')}</div>
      </header>`;
  },

  bindLayout() {
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.page));
    });
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Store.logout(); this.currentUser = null; this.navigate('login');
    });
    document.getElementById('mobile-menu')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
    });
  },

  // ===== LOGIN PAGE =====
  renderLoginPage() {
    return `
      <div class="login-wrapper">
        <div class="login-bg"><div class="login-orb"></div><div class="login-orb"></div><div class="login-orb"></div></div>
        <div class="login-card">
          <div class="login-logo">
            <div class="login-logo-icon"><img src="assets/logo.png" alt="Innovexa Hub"></div>
            <h1>Innovexa Hub</h1>
            <p>University Tech Club — Bangalore</p>
          </div>
          <form id="login-form">
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="login-email" placeholder="your@email.com" required></div>
            <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" id="login-password" placeholder="Enter password" required></div>
            <button type="submit" class="btn btn-primary btn-full">Sign In</button>
          </form>
          <div class="divider">or</div>
          <button class="btn-google" id="google-btn">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9s0 .001 0 0a8.996 8.996 0 00.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
        </div>
      </div>`;
  },

  bindLoginPage() {
    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pw = document.getElementById('login-password').value;
      const user = Store.login(email, pw);
      if (user) { this.currentUser = user; this.navigate('dashboard'); this.showToast(`Welcome back, ${user.name}!`, 'success'); }
      else this.showToast('Invalid email or password', 'error');
    });
    document.getElementById('google-btn')?.addEventListener('click', () => {
      this.showToast('Google OAuth requires server setup. Use email/password for now.', 'info');
    });
  },

  // ===== DASHBOARD =====
  renderDashboard() {
    const u = this.currentUser;
    const users = Store.getUsers();
    const events = Store.getUpcomingEvents();
    const anns = Store.getAnnouncements().slice(0, 3);
    return `
      <div class="dashboard-welcome"><h2>Welcome back, ${u.name}! 👋</h2><p>Here's what's happening at Innovexa Hub today.</p></div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><span class="material-symbols-rounded">group</span></div></div><div class="stat-value">${users.length}</div><div class="stat-label">Total Members</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><span class="material-symbols-rounded">event</span></div></div><div class="stat-value">${events.length}</div><div class="stat-label">Upcoming Events</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon amber"><span class="material-symbols-rounded">emoji_events</span></div></div><div class="stat-value">${u.points||0}</div><div class="stat-label">Your Points</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><span class="material-symbols-rounded">chat</span></div></div><div class="stat-value">${Store.getMessages().length}</div><div class="stat-label">Chat Messages</div></div>
      </div>
      <div class="dashboard-grid">
        <div class="widget"><div class="widget-header"><div class="widget-title"><span class="material-symbols-rounded">event</span>Upcoming Events</div><span class="widget-link" data-page="events">View All</span></div>
          <div class="widget-body">${events.length ? events.slice(0,3).map(ev => {
            const md = this.getMonthDay(ev.date);
            return `<div class="event-mini"><div class="event-mini-date"><div class="event-mini-month">${md.month}</div><div class="event-mini-day">${md.day}</div></div><div class="event-mini-info"><h4>${ev.title}</h4><p>${ev.time} · ${ev.location}</p></div></div>`;
          }).join('') : '<div class="empty-state"><p>No upcoming events</p></div>'}</div></div>
        <div class="widget"><div class="widget-header"><div class="widget-title"><span class="material-symbols-rounded">campaign</span>Announcements</div></div>
          <div class="widget-body">${anns.length ? anns.map(a => `<div class="announcement-item"><h4>${a.title}</h4><p>${a.content}</p><div class="date">${this.formatDate(a.date)}</div></div>`).join('') : '<div class="empty-state"><p>No announcements</p></div>'}</div></div>
      </div>`;
  },

  bindDashboard() {
    document.querySelectorAll('.widget-link[data-page]').forEach(l => l.addEventListener('click', () => this.navigate(l.dataset.page)));
  },

  // ===== EVENTS =====
  renderEvents() {
    const upcoming = Store.getUpcomingEvents();
    const past = Store.getPastEvents();
    const list = this.eventTab === 'upcoming' ? upcoming : past;
    const filtered = this.eventFilter === 'all' ? list : list.filter(e => e.category === this.eventFilter);
    const isAdmin = this.currentUser?.role === 'admin';
    const cats = ['all','workshop','hackathon','talk','social'];
    return `
      <div class="page-header"><h2>Events</h2>${isAdmin ? '<button class="btn btn-primary btn-sm" id="add-event-btn"><span class="material-symbols-rounded" style="font-size:16px">add</span>New Event</button>' : ''}</div>
      <div class="tab-bar"><button class="tab ${this.eventTab==='upcoming'?'active':''}" data-tab="upcoming">Upcoming (${upcoming.length})</button><button class="tab ${this.eventTab==='past'?'active':''}" data-tab="past">Past (${past.length})</button></div>
      <div class="filter-bar">${cats.map(c => `<button class="filter-chip ${this.eventFilter===c?'active':''}" data-filter="${c}">${c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('')}</div>
      <div class="events-grid">${filtered.length ? filtered.map(ev => this.renderEventCard(ev)).join('') : '<div class="empty-state"><span class="material-symbols-rounded">event_busy</span><h3>No events found</h3><p>Check back later!</p></div>'}</div>`;
  },

  renderEventCard(ev) {
    const isAdmin = this.currentUser?.role === 'admin';
    const rsvped = ev.rsvps?.includes(this.currentUser?.id);
    return `
      <div class="event-card">
        <div class="event-card-image cat-bg-${ev.category}"><span class="material-symbols-rounded">event</span><span class="event-category-badge category-${ev.category}">${ev.category}</span></div>
        <div class="event-card-body">
          <div class="event-card-title">${ev.title}</div>
          <div class="event-card-desc">${ev.description}</div>
          <div class="event-meta">
            <div class="event-meta-item"><span class="material-symbols-rounded">calendar_today</span>${this.formatDate(ev.date)}</div>
            <div class="event-meta-item"><span class="material-symbols-rounded">schedule</span>${ev.time}</div>
            <div class="event-meta-item"><span class="material-symbols-rounded">location_on</span>${ev.location}</div>
          </div>
          <div class="event-card-footer">
            <span class="rsvp-count">${ev.rsvps?.length||0} attending</span>
            <div style="display:flex;gap:6px;align-items:center">
              ${isAdmin ? `<button class="btn-icon" data-edit-event="${ev.id}" title="Edit"><span class="material-symbols-rounded" style="font-size:16px">edit</span></button><button class="btn-icon" data-del-event="${ev.id}" title="Delete"><span class="material-symbols-rounded" style="font-size:16px">delete</span></button>` : ''}
              <button class="btn btn-sm ${rsvped ? 'btn-success' : 'btn-primary'}" data-rsvp="${ev.id}">${rsvped ? 'Attending ✓' : 'RSVP'}</button>
            </div>
          </div>
        </div>
      </div>`;
  },

  bindEvents() {
    document.querySelectorAll('.tab[data-tab]').forEach(t => t.addEventListener('click', () => { this.eventTab = t.dataset.tab; this.renderCurrentPage(); }));
    document.querySelectorAll('.filter-chip[data-filter]').forEach(f => f.addEventListener('click', () => { this.eventFilter = f.dataset.filter; this.renderCurrentPage(); }));
    document.querySelectorAll('[data-rsvp]').forEach(b => b.addEventListener('click', () => {
      Store.toggleRSVP(b.dataset.rsvp, this.currentUser.id);
      Store.addPoints(this.currentUser.id, 10);
      this.renderCurrentPage();
    }));
    document.querySelectorAll('[data-del-event]').forEach(b => b.addEventListener('click', () => { Store.deleteEvent(b.dataset.delEvent); this.showToast('Event deleted', 'success'); this.renderCurrentPage(); }));
    document.getElementById('add-event-btn')?.addEventListener('click', () => this.showEventModal());
    document.querySelectorAll('[data-edit-event]').forEach(b => b.addEventListener('click', () => this.showEventModal(b.dataset.editEvent)));
  },

  showEventModal(editId) {
    const ev = editId ? Store.getEvents().find(e => e.id === editId) : null;
    this.showModal(`
      <div class="modal-header"><h3>${ev ? 'Edit Event' : 'New Event'}</h3><button class="modal-close"><span class="material-symbols-rounded">close</span></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="ev-title" value="${ev?.title||''}" required></div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="ev-desc">${ev?.description||''}</textarea></div>
        <div class="form-row"><div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="ev-date" value="${ev?.date||''}"></div><div class="form-group"><label class="form-label">Time</label><input class="form-input" id="ev-time" value="${ev?.time||''}" placeholder="e.g. 10:00 AM - 1:00 PM"></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">Location</label><input class="form-input" id="ev-loc" value="${ev?.location||''}"></div><div class="form-group"><label class="form-label">Category</label><select class="form-input" id="ev-cat"><option value="workshop" ${ev?.category==='workshop'?'selected':''}>Workshop</option><option value="hackathon" ${ev?.category==='hackathon'?'selected':''}>Hackathon</option><option value="talk" ${ev?.category==='talk'?'selected':''}>Talk</option><option value="social" ${ev?.category==='social'?'selected':''}>Social</option><option value="others" ${ev && !['workshop','hackathon','talk','social'].includes(ev.category) ? 'selected' : ''}>Others...</option></select><input class="form-input" id="ev-cat-custom" placeholder="Type category name" value="${ev && !['workshop','hackathon','talk','social'].includes(ev.category) ? ev.category : ''}" style="margin-top:8px; display:${ev && !['workshop','hackathon','talk','social'].includes(ev.category) ? 'block' : 'none'}"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" id="ev-cancel">Cancel</button><button class="btn btn-primary" id="ev-save">Save</button></div>`);
    document.getElementById('ev-cancel')?.addEventListener('click', () => this.closeModal());
    document.getElementById('ev-cat')?.addEventListener('change', e => {
      document.getElementById('ev-cat-custom').style.display = e.target.value === 'others' ? 'block' : 'none';
      if (e.target.value === 'others') document.getElementById('ev-cat-custom').focus();
    });
    document.getElementById('ev-save')?.addEventListener('click', () => {
      let cat = document.getElementById('ev-cat').value;
      if (cat === 'others') {
        cat = document.getElementById('ev-cat-custom').value.trim();
        if (!cat) { this.showToast('Please type a custom category', 'error'); return; }
      }
      const data = { title: document.getElementById('ev-title').value, description: document.getElementById('ev-desc').value, date: document.getElementById('ev-date').value, time: document.getElementById('ev-time').value, location: document.getElementById('ev-loc').value, category: cat.toLowerCase(), createdBy: this.currentUser.id };
      if (!data.title || !data.date) { this.showToast('Title and date required', 'error'); return; }
      if (editId) Store.updateEvent(editId, data); else Store.addEvent(data);
      this.closeModal(); this.showToast(editId ? 'Event updated!' : 'Event created!', 'success'); this.renderCurrentPage();
    });
  },

  // ===== CHAT =====
  renderChat() {
    const msgs = Store.getMessages();
    return `
      <div class="chat-container">
        <div class="chat-header"><div class="chat-header-icon"><span class="material-symbols-rounded">forum</span></div><div class="chat-header-info"><h3>Innovexa Hub Chat</h3><p>${Store.getUsers().length} members</p></div></div>
        <div class="chat-messages" id="chat-messages">${msgs.map(m => this.renderMessage(m)).join('')}</div>
        <div class="chat-input-area"><input class="chat-input" id="chat-input" placeholder="Type a message..." maxlength="500"><button class="chat-send-btn" id="chat-send"><span class="material-symbols-rounded">send</span></button></div>
      </div>`;
  },

  renderMessage(m) {
    const sender = Store.getUserById(m.userId);
    const isOwn = m.userId === this.currentUser?.id;
    return `<div class="message ${isOwn ? 'own' : ''}">
      ${this.avatarHTML(sender?.name || '?', 'avatar-sm')}
      <div><div class="message-sender">${sender?.name || 'Unknown'}</div><div class="message-bubble"><div class="message-text">${m.text}</div></div><div class="message-time">${this.timeAgo(m.timestamp)}</div></div>
    </div>`;
  },

  bindChat() {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
    const send = () => {
      const input = document.getElementById('chat-input');
      const text = input?.value.trim();
      if (!text) return;
      Store.addMessage(text, this.currentUser.id);
      input.value = '';
      this.renderCurrentPage();
    };
    document.getElementById('chat-send')?.addEventListener('click', send);
    document.getElementById('chat-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  },

  // ===== PROFILE =====
  renderProfile() {
    const uid = this.params.userId || this.currentUser.id;
    const u = Store.getUserById(uid);
    if (!u) return '<div class="empty-state"><h3>User not found</h3></div>';
    const isOwn = uid === this.currentUser.id;
    const eventsAttended = Store.getPastEvents().filter(e => e.rsvps?.includes(uid)).length;
    return `
      <div class="profile-hero">
        ${isOwn ? '<button class="btn btn-secondary btn-sm profile-edit-btn" id="edit-profile-btn"><span class="material-symbols-rounded" style="font-size:16px">edit</span>Edit</button>' : ''}
        ${this.avatarHTML(u.name, 'avatar-xxl')}
        <div class="profile-name">${u.name}</div>
        <div class="profile-email">${u.email}</div>
        <span class="profile-role-badge role-${u.role}">${u.role}</span>
        <div class="profile-stats-bar">
          <div class="profile-stat"><div class="profile-stat-value">${u.points||0}</div><div class="profile-stat-label">Points</div></div>
          <div class="profile-stat"><div class="profile-stat-value">${u.badges?.length||0}</div><div class="profile-stat-label">Badges</div></div>
          <div class="profile-stat"><div class="profile-stat-value">${eventsAttended}</div><div class="profile-stat-label">Events Joined</div></div>
          <div class="profile-stat"><div class="profile-stat-value">${this.formatDate(u.joinDate)}</div><div class="profile-stat-label">Joined</div></div>
        </div>
      </div>
      <div class="profile-grid">
        <div class="profile-section"><h3><span class="material-symbols-rounded">info</span>About</h3><p class="profile-bio">${u.bio || 'No bio yet.'}</p></div>
        <div class="profile-section"><h3><span class="material-symbols-rounded">code</span>Skills</h3><div class="skill-tags">${(u.skills||[]).length ? u.skills.map(s => `<span class="skill-tag">${s}</span>`).join('') : '<span style="color:var(--text-muted)">No skills added</span>'}</div></div>
        <div class="profile-section"><h3><span class="material-symbols-rounded">verified</span>Badges</h3><div class="badge-list">${(u.badges||[]).length ? u.badges.map(b => `<div class="badge-item"><span class="material-symbols-rounded">emoji_events</span>${b}</div>`).join('') : '<span style="color:var(--text-muted)">No badges yet</span>'}</div></div>
        <div class="profile-section"><h3><span class="material-symbols-rounded">link</span>Social</h3><div class="social-links">${u.github ? `<div class="social-link"><span class="material-symbols-rounded">code</span>github.com/${u.github}</div>` : ''}${u.linkedin ? `<div class="social-link"><span class="material-symbols-rounded">person</span>linkedin.com/in/${u.linkedin}</div>` : ''}${!u.github && !u.linkedin ? '<span style="color:var(--text-muted)">No socials linked</span>' : ''}</div></div>
      </div>`;
  },

  bindProfile() {
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => this.showProfileEditModal());
  },

  showProfileEditModal() {
    const u = this.currentUser;
    this.showModal(`
      <div class="modal-header"><h3>Edit Profile</h3><button class="modal-close"><span class="material-symbols-rounded">close</span></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="ep-name" value="${u.name}"></div>
        <div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" id="ep-bio">${u.bio||''}</textarea></div>
        <div class="form-group"><label class="form-label">Skills (comma separated)</label><input class="form-input" id="ep-skills" value="${(u.skills||[]).join(', ')}"></div>
        <div class="form-row"><div class="form-group"><label class="form-label">GitHub username</label><input class="form-input" id="ep-github" value="${u.github||''}"></div><div class="form-group"><label class="form-label">LinkedIn username</label><input class="form-input" id="ep-linkedin" value="${u.linkedin||''}"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" id="ep-cancel">Cancel</button><button class="btn btn-primary" id="ep-save">Save</button></div>`);
    document.getElementById('ep-cancel')?.addEventListener('click', () => this.closeModal());
    document.getElementById('ep-save')?.addEventListener('click', () => {
      const data = { name: document.getElementById('ep-name').value, bio: document.getElementById('ep-bio').value, skills: document.getElementById('ep-skills').value.split(',').map(s=>s.trim()).filter(Boolean), github: document.getElementById('ep-github').value, linkedin: document.getElementById('ep-linkedin').value };
      Store.updateUser(this.currentUser.id, data);
      this.currentUser = Store.getCurrentUser();
      this.closeModal(); this.showToast('Profile updated!', 'success'); this.render();
    });
  },

  // ===== MEMBERS =====
  renderMembers() {
    const users = Store.getUsers();
    return `
      <div class="page-header"><h2>Members (${users.length})</h2><div class="search-bar"><span class="material-symbols-rounded">search</span><input class="search-input" id="member-search" placeholder="Search members..."></div></div>
      <div class="members-grid" id="members-grid">${users.map(u => `
        <div class="member-card" data-view-member="${u.id}">
          ${this.avatarHTML(u.name, 'avatar-lg')}
          <div class="member-card-name">${u.name}</div>
          <div class="member-card-email">${u.email}</div>
          <span class="profile-role-badge role-${u.role}" style="font-size:10px;padding:2px 10px">${u.role}</span>
          <div class="member-card-skills">${(u.skills||[]).slice(0,3).map(s => `<span class="member-card-skill">${s}</span>`).join('')}</div>
        </div>`).join('')}</div>`;
  },

  bindMembers() {
    document.querySelectorAll('[data-view-member]').forEach(c => c.addEventListener('click', () => { this.params = { userId: c.dataset.viewMember }; this.currentPage = 'profile'; this.render(); }));
    document.getElementById('member-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.member-card').forEach(c => { c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    });
  },

  // ===== ADMIN =====
  renderAdmin() {
    if (this.currentUser?.role !== 'admin') return '<div class="empty-state"><h3>Access Denied</h3><p>Admin only</p></div>';
    const tabs = [{ id:'members', icon:'group', label:'Members' }, { id:'events', icon:'event', label:'Events' }, { id:'announcements', icon:'campaign', label:'Announcements' }];
    return `
      <div class="admin-tabs">${tabs.map(t => `<button class="admin-tab ${this.adminTab===t.id?'active':''}" data-admin-tab="${t.id}"><span class="material-symbols-rounded" style="font-size:18px">${t.icon}</span>${t.label}</button>`).join('')}</div>
      <div id="admin-content">${this.renderAdminContent()}</div>`;
  },

  renderAdminContent() {
    if (this.adminTab === 'members') return this.renderAdminMembers();
    if (this.adminTab === 'events') return this.renderAdminEvents();
    return this.renderAdminAnnouncements();
  },

  renderAdminMembers() {
    const users = Store.getUsers();
    return `
      <div class="admin-form"><h3>Add New Member</h3>
        <div class="form-row"><div class="form-group"><label class="form-label">Name</label><input class="form-input" id="am-name" placeholder="Full name"></div><div class="form-group"><label class="form-label">Email</label><input class="form-input" id="am-email" placeholder="email@innovexahub.com"></div></div>
        <div class="form-row"><div class="form-group"><label class="form-label">Password</label><input class="form-input" id="am-pass" placeholder="Set password"></div><div class="form-group"><label class="form-label">Join Date</label><input class="form-input" type="date" id="am-date" value="${new Date().toISOString().split('T')[0]}"></div></div>
        <div style="margin-top: 16px"><button class="btn btn-primary" id="am-add">Add Member</button></div>
      </div>
      <table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Points</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>${users.map(u => `<tr><td><div style="display:flex;align-items:center;gap:8px">${this.avatarHTML(u.name,'avatar-sm')}${u.name}</div></td><td>${u.email}</td><td><span class="profile-role-badge role-${u.role}" style="font-size:10px;padding:2px 8px">${u.role}</span></td><td>${u.points||0}</td><td>${this.formatDate(u.joinDate)}</td><td>${u.role!=='admin'?`<button class="btn btn-danger btn-sm" data-remove-user="${u.id}">Remove</button>`:'-'}</td></tr>`).join('')}</tbody>
      </table>`;
  },

  renderAdminEvents() {
    const events = Store.getEvents().sort((a,b) => b.date.localeCompare(a.date));
    return `
      <div style="margin-bottom:16px"><button class="btn btn-primary btn-sm" id="admin-add-event"><span class="material-symbols-rounded" style="font-size:16px">add</span>New Event</button></div>
      <table class="admin-table"><thead><tr><th>Title</th><th>Date</th><th>Category</th><th>RSVPs</th><th>Actions</th></tr></thead>
        <tbody>${events.map(e => `<tr><td>${e.title}</td><td>${this.formatDate(e.date)}</td><td><span class="filter-chip active" style="cursor:default">${e.category}</span></td><td>${e.rsvps?.length||0}</td><td><div style="display:flex;gap:6px"><button class="btn btn-secondary btn-sm" data-edit-event="${e.id}">Edit</button><button class="btn btn-danger btn-sm" data-del-event="${e.id}">Delete</button></div></td></tr>`).join('')}</tbody>
      </table>`;
  },

  renderAdminAnnouncements() {
    const anns = Store.getAnnouncements();
    return `
      <div class="admin-form"><h3>Post Announcement</h3>
        <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="ann-title" placeholder="Announcement title"></div>
        <div class="form-group"><label class="form-label">Content</label><textarea class="form-input" id="ann-content" placeholder="Write your announcement..."></textarea></div>
        <button class="btn btn-primary" id="ann-post">Post</button>
      </div>
      <div>${anns.map(a => `<div class="announcement-item" style="background:var(--bg-card);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-color);margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start"><h4>${a.title}</h4><button class="btn-icon" data-del-ann="${a.id}"><span class="material-symbols-rounded" style="font-size:16px">delete</span></button></div><p>${a.content}</p><div class="date">${this.formatDate(a.date)}</div>
      </div>`).join('')}</div>`;
  },

  bindAdmin() {
    document.querySelectorAll('[data-admin-tab]').forEach(t => t.addEventListener('click', () => { this.adminTab = t.dataset.adminTab; this.renderCurrentPage(); }));
    // Add member
    document.getElementById('am-add')?.addEventListener('click', () => {
      const name = document.getElementById('am-name')?.value.trim();
      const email = document.getElementById('am-email')?.value.trim();
      const password = document.getElementById('am-pass')?.value;
      const joinDate = document.getElementById('am-date')?.value;
      if (!name || !email || !password) { this.showToast('Name, email, and password required', 'error'); return; }
      if (Store.getUsers().find(u => u.email === email)) { this.showToast('Email already exists', 'error'); return; }
      Store.addUser({ name, email, password, role: 'member', joinDate });
      this.showToast(`${name} added successfully!`, 'success'); this.renderCurrentPage();
    });
    // Remove member
    document.querySelectorAll('[data-remove-user]').forEach(b => b.addEventListener('click', () => { Store.deleteUser(b.dataset.removeUser); this.showToast('Member removed', 'success'); this.renderCurrentPage(); }));
    // Events
    document.getElementById('admin-add-event')?.addEventListener('click', () => this.showEventModal());
    document.querySelectorAll('[data-edit-event]').forEach(b => b.addEventListener('click', () => this.showEventModal(b.dataset.editEvent)));
    document.querySelectorAll('[data-del-event]').forEach(b => b.addEventListener('click', () => { Store.deleteEvent(b.dataset.delEvent); this.showToast('Event deleted', 'success'); this.renderCurrentPage(); }));
    // Announcements
    document.getElementById('ann-post')?.addEventListener('click', () => {
      const title = document.getElementById('ann-title')?.value.trim();
      const content = document.getElementById('ann-content')?.value.trim();
      if (!title || !content) { this.showToast('Fill in all fields', 'error'); return; }
      Store.addAnnouncement(title, content, this.currentUser.id);
      this.showToast('Announcement posted!', 'success'); this.renderCurrentPage();
    });
    document.querySelectorAll('[data-del-ann]').forEach(b => b.addEventListener('click', () => { Store.deleteAnnouncement(b.dataset.delAnn); this.showToast('Deleted', 'success'); this.renderCurrentPage(); }));
  },

  // ===== LEADERBOARD =====
  renderLeaderboard() {
    const users = Store.getUsers().sort((a,b) => (b.points||0) - (a.points||0));
    const medals = ['🥇','🥈','🥉'];
    const podiumCls = ['gold','silver','bronze'];
    const top3 = users.slice(0, 3);
    const rest = users.slice(3);
    return `
      <div class="page-header"><h2>Leaderboard</h2></div>
      ${top3.length ? `<div class="podium">${top3.map((u,i) => `
        <div class="podium-item ${podiumCls[i]}">
          <div class="podium-rank">${medals[i]}</div>
          ${this.avatarHTML(u.name, 'avatar-lg')}
          <div class="podium-name">${u.name}</div>
          <div class="podium-points">${u.points||0}</div>
          <div class="podium-label">points</div>
        </div>`).join('')}</div>` : ''}
      ${rest.length ? `<div class="rank-list">${rest.map((u,i) => `
        <div class="rank-item">
          <div class="rank-number">#${i+4}</div>
          ${this.avatarHTML(u.name, 'avatar-sm')}
          <div class="rank-info"><div class="rank-name">${u.name}</div><div class="rank-badges">${(u.badges||[]).join(' · ') || 'No badges'}</div></div>
          <div><span class="rank-points">${u.points||0}</span> <span class="rank-points-label">pts</span></div>
        </div>`).join('')}</div>` : ''}`;
  },

  // ===== RESOURCES =====
  renderResources() {
    const resources = Store.getResources();
    const cats = ['all','tutorials','tools','projects'];
    const filtered = this.resourceFilter === 'all' ? resources : resources.filter(r => r.category === this.resourceFilter);
    return `
      <div class="page-header"><h2>Resources</h2><button class="btn btn-primary btn-sm" id="add-res-btn"><span class="material-symbols-rounded" style="font-size:16px">add</span>Add Resource</button></div>
      <div class="filter-bar">${cats.map(c => `<button class="filter-chip ${this.resourceFilter===c?'active':''}" data-res-filter="${c}">${c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('')}</div>
      <div class="resources-grid">${filtered.length ? filtered.map(r => {
        const author = Store.getUserById(r.addedBy);
        const upvoted = r.upvotes?.includes(this.currentUser?.id);
        return `<div class="resource-card">
          <span class="resource-category-badge res-cat-${r.category}">${r.category}</span>
          <div class="resource-title">${r.title}</div>
          <div class="resource-desc">${r.description}</div>
          <div style="margin-bottom:12px"><a href="${r.link}" target="_blank" style="font-size:12px;display:flex;align-items:center;gap:4px"><span class="material-symbols-rounded" style="font-size:14px">open_in_new</span>Open Resource</a></div>
          <div class="resource-footer"><span class="resource-author">by ${author?.name||'Unknown'}</span><button class="upvote-btn ${upvoted?'active':''}" data-upvote="${r.id}"><span class="material-symbols-rounded">thumb_up</span>${r.upvotes?.length||0}</button></div>
        </div>`;
      }).join('') : '<div class="empty-state"><span class="material-symbols-rounded">library_books</span><h3>No resources</h3></div>'}</div>`;
  },

  bindResources() {
    document.querySelectorAll('[data-res-filter]').forEach(f => f.addEventListener('click', () => { this.resourceFilter = f.dataset.resFilter; this.renderCurrentPage(); }));
    document.querySelectorAll('[data-upvote]').forEach(b => b.addEventListener('click', () => { Store.toggleUpvote(b.dataset.upvote, this.currentUser.id); this.renderCurrentPage(); }));
    document.getElementById('add-res-btn')?.addEventListener('click', () => {
      this.showModal(`
        <div class="modal-header"><h3>Add Resource</h3><button class="modal-close"><span class="material-symbols-rounded">close</span></button></div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="res-title" placeholder="Resource title"></div>
          <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="res-desc" placeholder="Brief description"></textarea></div>
          <div class="form-group"><label class="form-label">Link</label><input class="form-input" id="res-link" placeholder="https://..."></div>
          <div class="form-group"><label class="form-label">Category</label><select class="form-input" id="res-cat"><option value="tutorials">Tutorials</option><option value="tools">Tools</option><option value="projects">Projects</option></select></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" id="res-cancel">Cancel</button><button class="btn btn-primary" id="res-save">Add</button></div>`);
      document.getElementById('res-cancel')?.addEventListener('click', () => this.closeModal());
      document.getElementById('res-save')?.addEventListener('click', () => {
        const data = { title: document.getElementById('res-title').value, description: document.getElementById('res-desc').value, link: document.getElementById('res-link').value, category: document.getElementById('res-cat').value, addedBy: this.currentUser.id };
        if (!data.title) { this.showToast('Title required', 'error'); return; }
        Store.addResource(data); this.closeModal(); this.showToast('Resource added!', 'success'); this.renderCurrentPage();
      });
    });
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
