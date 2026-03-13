/* ============================================
   INNOVEXA HUB — Data Store (localStorage)
   ============================================ */

const Store = {
  KEYS: {
    USERS: 'ih_users',
    EVENTS: 'ih_events',
    MESSAGES: 'ih_messages',
    ANNOUNCEMENTS: 'ih_announcements',
    RESOURCES: 'ih_resources',
    CURRENT_USER: 'ih_current_user',
    INITIALIZED: 'ih_initialized',
  },

  init() {
    if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
      this.seed();
    }
  },

  reset() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.seed();
  },

  seed() {
    const users = [
      {
        id: 'admin-1',
        name: 'Jaiakash',
        email: 'jaiakash@innovexahub.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Founder & Lead of Innovexa Hub. Passionate about building tech communities and empowering student developers.',
        skills: ['Leadership', 'Web Development', 'AI/ML', 'Community Building'],
        github: 'jaiakash',
        linkedin: 'jaiakash',
        joinDate: '2024-01-15',
        points: 1500,
        badges: ['Founder', 'Event Master', 'Code Ninja'],
      },
      {
        id: 'member-1',
        name: 'Priya Sharma',
        email: 'priya@innovexahub.com',
        password: 'member123',
        role: 'member',
        bio: 'Computer Science student passionate about open source and machine learning.',
        skills: ['Python', 'React', 'Machine Learning', 'Data Science'],
        github: 'priyasharma',
        linkedin: 'priyasharma',
        joinDate: '2024-02-10',
        points: 850,
        badges: ['Early Member', 'Hackathon Winner'],
      },
      {
        id: 'member-2',
        name: 'Arjun Patel',
        email: 'arjun@innovexahub.com',
        password: 'member123',
        role: 'member',
        bio: 'Full-stack developer and UI/UX enthusiast. Love crafting beautiful interfaces.',
        skills: ['JavaScript', 'Figma', 'Node.js', 'TypeScript'],
        github: 'arjunpatel',
        linkedin: 'arjunpatel',
        joinDate: '2024-03-05',
        points: 720,
        badges: ['Design Star', 'Mentor'],
      },
      {
        id: 'member-3',
        name: 'Kavya Reddy',
        email: 'kavya@innovexahub.com',
        password: 'member123',
        role: 'member',
        bio: 'Cybersecurity enthusiast and CTF player. Breaking things to make them stronger.',
        skills: ['Cybersecurity', 'Linux', 'Networking', 'Python'],
        github: 'kavyareddy',
        linkedin: 'kavyareddy',
        joinDate: '2024-04-20',
        points: 680,
        badges: ['Security Expert'],
      },
      {
        id: 'member-4',
        name: 'Rohan Desai',
        email: 'rohan@innovexahub.com',
        password: 'member123',
        role: 'member',
        bio: 'Mobile app developer specializing in Flutter and React Native.',
        skills: ['Flutter', 'Dart', 'React Native', 'Firebase'],
        github: 'rohandesai',
        linkedin: 'rohandesai',
        joinDate: '2024-05-15',
        points: 520,
        badges: ['App Wizard'],
      },
    ];

    const events = [
      {
        id: 'event-1',
        title: 'AI/ML Workshop: Building Your First Neural Network',
        description: 'Hands-on workshop where you will build a neural network from scratch using Python and TensorFlow. Perfect for beginners and intermediate learners.',
        date: '2026-03-20',
        time: '10:00 AM - 1:00 PM',
        location: 'Room 301, CS Building',
        category: 'workshop',
        rsvps: ['admin-1', 'member-1', 'member-3'],
        createdBy: 'admin-1',
      },
      {
        id: 'event-2',
        title: 'Innovexa Hackathon 2026',
        description: '24-hour hackathon to build innovative solutions for campus problems. Amazing prizes, mentors from industry, and free food!',
        date: '2026-04-05',
        time: '9:00 AM (24 hours)',
        location: 'Main Auditorium',
        category: 'hackathon',
        rsvps: ['admin-1', 'member-1', 'member-2', 'member-3', 'member-4'],
        createdBy: 'admin-1',
      },
      {
        id: 'event-3',
        title: 'Cloud Computing 101 with AWS',
        description: 'Introduction to cloud services, deploying your first app on AWS, and understanding the cloud ecosystem.',
        date: '2026-04-15',
        time: '2:00 PM - 5:00 PM',
        location: 'Lab 202',
        category: 'workshop',
        rsvps: ['member-2', 'member-4'],
        createdBy: 'admin-1',
      },
      {
        id: 'event-4',
        title: 'Web3 & Blockchain Talk',
        description: 'Industry expert talk on the future of Web3, DeFi, and blockchain technology. Q&A session included.',
        date: '2026-02-15',
        time: '2:00 PM - 4:00 PM',
        location: 'Seminar Hall B',
        category: 'talk',
        rsvps: ['admin-1', 'member-2'],
        createdBy: 'admin-1',
      },
      {
        id: 'event-5',
        title: 'Club Social: Game Night',
        description: 'Relax and connect with fellow members over board games, video games, and snacks!',
        date: '2026-01-25',
        time: '6:00 PM - 9:00 PM',
        location: 'Student Lounge',
        category: 'social',
        rsvps: ['admin-1', 'member-1', 'member-2', 'member-3', 'member-4'],
        createdBy: 'admin-1',
      },
      {
        id: 'event-6',
        title: 'Open Source Contribution Day',
        description: 'Learn how to contribute to open source projects. We will guide you through making your first PR!',
        date: '2026-02-28',
        time: '10:00 AM - 4:00 PM',
        location: 'Room 105',
        category: 'workshop',
        rsvps: ['admin-1', 'member-1', 'member-3'],
        createdBy: 'admin-1',
      },
    ];

    const messages = [
      {
        id: 'msg-1', userId: 'admin-1',
        text: 'Welcome to Innovexa Hub chat! 🚀 Feel free to discuss anything tech-related here.',
        timestamp: '2026-03-13T10:00:00',
      },
      {
        id: 'msg-2', userId: 'member-1',
        text: 'Hey everyone! Excited for the AI/ML workshop next week! 🤖',
        timestamp: '2026-03-13T10:30:00',
      },
      {
        id: 'msg-3', userId: 'member-2',
        text: "Same here! I've been reading about TensorFlow. Should I prepare anything beforehand?",
        timestamp: '2026-03-13T11:00:00',
      },
      {
        id: 'msg-4', userId: 'admin-1',
        text: "Just make sure you have Python installed. We'll cover everything else in the workshop!",
        timestamp: '2026-03-13T11:15:00',
      },
      {
        id: 'msg-5', userId: 'member-3',
        text: 'Also, anyone interested in forming a team for the hackathon? 💡',
        timestamp: '2026-03-13T12:00:00',
      },
      {
        id: 'msg-6', userId: 'member-4',
        text: "Count me in! I can handle the mobile app part if we need one. 📱",
        timestamp: '2026-03-13T12:20:00',
      },
      {
        id: 'msg-7', userId: 'member-1',
        text: "Awesome! Let's plan during the next meetup. Are we doing Flutter or React Native?",
        timestamp: '2026-03-13T12:45:00',
      },
    ];

    const announcements = [
      {
        id: 'ann-1',
        title: '🎉 Welcome to Innovexa Hub Portal!',
        content: "We're thrilled to launch our new members portal. Stay connected, RSVP to events, and make the most of your club experience!",
        date: '2026-03-13',
        createdBy: 'admin-1',
      },
      {
        id: 'ann-2',
        title: '📋 Hackathon Registration Open',
        content: 'Registration for Innovexa Hackathon 2026 is now open! Form teams of 2-4 and RSVP through the events page.',
        date: '2026-03-12',
        createdBy: 'admin-1',
      },
      {
        id: 'ann-3',
        title: '🏆 New Leaderboard System',
        content: 'Earn points by attending events, chatting, and contributing resources. Top performers each month get special perks!',
        date: '2026-03-10',
        createdBy: 'admin-1',
      },
    ];

    const resources = [
      {
        id: 'res-1',
        title: 'Intro to Git & GitHub',
        description: 'Comprehensive guide for beginners to learn version control with Git and collaboration on GitHub.',
        link: 'https://docs.github.com/en/get-started',
        category: 'tutorials',
        upvotes: ['admin-1', 'member-1', 'member-2'],
        addedBy: 'admin-1',
        date: '2026-03-10',
      },
      {
        id: 'res-2',
        title: 'React Official Tutorial',
        description: 'Learn React by building an interactive tic-tac-toe game. Great for understanding component-based UI.',
        link: 'https://react.dev/learn',
        category: 'tutorials',
        upvotes: ['member-1', 'member-3'],
        addedBy: 'member-1',
        date: '2026-03-08',
      },
      {
        id: 'res-3',
        title: 'VS Code Tips & Tricks',
        description: 'Best extensions and keyboard shortcuts to boost your productivity in Visual Studio Code.',
        link: 'https://code.visualstudio.com/docs',
        category: 'tools',
        upvotes: ['admin-1', 'member-2', 'member-4'],
        addedBy: 'member-2',
        date: '2026-03-05',
      },
      {
        id: 'res-4',
        title: 'Build a Portfolio Website',
        description: 'Step-by-step project idea: create a stunning personal portfolio with HTML, CSS, and JavaScript.',
        link: 'https://developer.mozilla.org',
        category: 'projects',
        upvotes: ['member-1'],
        addedBy: 'member-4',
        date: '2026-03-03',
      },
    ];

    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(events));
    localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(messages));
    localStorage.setItem(this.KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    localStorage.setItem(this.KEYS.RESOURCES, JSON.stringify(resources));
    localStorage.setItem(this.KEYS.INITIALIZED, 'true');
  },

  // --- Generic helpers ---
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  // --- Users ---
  getUsers() { return this._get(this.KEYS.USERS); },
  getUserById(id) { return this.getUsers().find(u => u.id === id); },
  addUser(user) {
    const users = this.getUsers();
    user.id = user.id || this.generateId('user');
    user.joinDate = user.joinDate || new Date().toISOString().split('T')[0];
    user.points = user.points || 0;
    user.badges = user.badges || [];
    user.skills = user.skills || [];
    user.bio = user.bio || '';
    user.github = user.github || '';
    user.linkedin = user.linkedin || '';
    users.push(user);
    this._set(this.KEYS.USERS, users);
    return user;
  },
  updateUser(id, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; this._set(this.KEYS.USERS, users); }
    // Also update current user session if it's the same user
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this._set(this.KEYS.CURRENT_USER, { ...current, ...data });
    }
    return users[idx];
  },
  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this._set(this.KEYS.USERS, users);
  },
  addPoints(userId, points) {
    const user = this.getUserById(userId);
    if (user) { this.updateUser(userId, { points: (user.points || 0) + points }); }
  },

  // --- Auth ---
  login(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      this._set(this.KEYS.CURRENT_USER, user);
      return user;
    }
    return null;
  },
  logout() { localStorage.removeItem(this.KEYS.CURRENT_USER); },
  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER)); }
    catch { return null; }
  },

  // --- Events ---
  getEvents() { return this._get(this.KEYS.EVENTS); },
  getUpcomingEvents() {
    const today = new Date().toISOString().split('T')[0];
    return this.getEvents().filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  },
  getPastEvents() {
    const today = new Date().toISOString().split('T')[0];
    return this.getEvents().filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  },
  addEvent(event) {
    const events = this.getEvents();
    event.id = this.generateId('event');
    event.rsvps = event.rsvps || [];
    events.push(event);
    this._set(this.KEYS.EVENTS, events);
    return event;
  },
  updateEvent(id, data) {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) { events[idx] = { ...events[idx], ...data }; this._set(this.KEYS.EVENTS, events); }
  },
  deleteEvent(id) {
    this._set(this.KEYS.EVENTS, this.getEvents().filter(e => e.id !== id));
  },
  toggleRSVP(eventId, userId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      const idx = event.rsvps.indexOf(userId);
      if (idx > -1) { event.rsvps.splice(idx, 1); }
      else { event.rsvps.push(userId); }
      this._set(this.KEYS.EVENTS, events);
      return event.rsvps.includes(userId);
    }
    return false;
  },

  // --- Messages ---
  getMessages() { return this._get(this.KEYS.MESSAGES); },
  addMessage(text, userId) {
    const messages = this.getMessages();
    const msg = {
      id: this.generateId('msg'),
      userId,
      text,
      timestamp: new Date().toISOString(),
    };
    messages.push(msg);
    this._set(this.KEYS.MESSAGES, messages);
    this.addPoints(userId, 5);
    return msg;
  },

  // --- Announcements ---
  getAnnouncements() { return this._get(this.KEYS.ANNOUNCEMENTS); },
  addAnnouncement(title, content, createdBy) {
    const anns = this.getAnnouncements();
    const ann = {
      id: this.generateId('ann'),
      title, content, createdBy,
      date: new Date().toISOString().split('T')[0],
    };
    anns.unshift(ann);
    this._set(this.KEYS.ANNOUNCEMENTS, anns);
    return ann;
  },
  deleteAnnouncement(id) {
    this._set(this.KEYS.ANNOUNCEMENTS, this.getAnnouncements().filter(a => a.id !== id));
  },

  // --- Resources ---
  getResources() { return this._get(this.KEYS.RESOURCES); },
  addResource(resource) {
    const resources = this.getResources();
    resource.id = this.generateId('res');
    resource.upvotes = [];
    resource.date = new Date().toISOString().split('T')[0];
    resources.push(resource);
    this._set(this.KEYS.RESOURCES, resources);
    return resource;
  },
  toggleUpvote(resourceId, userId) {
    const resources = this.getResources();
    const res = resources.find(r => r.id === resourceId);
    if (res) {
      const idx = res.upvotes.indexOf(userId);
      if (idx > -1) { res.upvotes.splice(idx, 1); }
      else { res.upvotes.push(userId); }
      this._set(this.KEYS.RESOURCES, resources);
    }
  },
  deleteResource(id) {
    this._set(this.KEYS.RESOURCES, this.getResources().filter(r => r.id !== id));
  },

  // --- Helpers ---
  generateId(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },
};

// Initialize data on load
Store.init();
