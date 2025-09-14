import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// --- HELPER DATA & FUNCTIONS ---

// Mock database of users
const USERS = [
    { userID: 1, name: 'Sofia', email: 'sofia@example.com' },
    { userID: 2, name: 'Erik', email: 'erik@example.com' },
    { userID: 3, name: 'Linnéa', email: 'linnea@example.com' },
    { userID: 4, name: 'Oskar', email: 'oskar@example.com' }
];

// Mock database of initial events
const INITIAL_EVENTS = [
    {
        eventID: 101,
        title: 'Morgonfika på Vete-Katten',
        description: 'Låt oss starta dagen med en klassisk svensk fika. Vi kan prata, njuta av lite kaffe och kanske en kanelbulle. Vete-Katten är ett väldigt mysigt och traditionellt ställe.',
        category: 'Fika',
        location: 'Kungsgatan 55, 111 22 Stockholm',
        dateTime: '2025-09-20T10:00:00',
        creatorUserID: 2,
        attendeeUserIDs: [2, 3]
    },
    {
        eventID: 102,
        title: 'Avkopplande promenad i Djurgården',
        description: 'En fridfull promenad genom den vackra naturen på Djurgården. Vi möts vid Djurgårdsbron och går i ungefär en timme. Ett bra sätt att få lite frisk luft.',
        category: 'Walk',
        location: 'Djurgårdsbron, Stockholm',
        dateTime: '2025-09-21T14:30:00',
        creatorUserID: 1,
        attendeeUserIDs: [1, 4]
    },
    {
        eventID: 103,
        title: 'Biokväll: Sci-Fi Premiär',
        description: 'Ska se den nya sci-fi-filmen på Filmstaden Scandinavia. Jag har hört fantastiska saker om den! Vi ses utanför entrén 15 minuter innan.',
        category: 'Cinema',
        location: 'Filmstaden Scandinavia, Solna',
        dateTime: '2025-09-22T19:00:00',
        creatorUserID: 4,
        attendeeUserIDs: [4, 1, 2]
    },
    {
        eventID: 104,
        title: 'Badminton i Frescatihallen',
        description: 'Letar efter en partner för en vänskapsmatch i badminton. Jag har bokat en bana i en timme. Alla färdighetsnivåer är välkomna!',
        category: 'Sports',
        location: 'Frescatihallen, Stockholm',
        dateTime: '2025-09-23T18:00:00',
        creatorUserID: 3,
        attendeeUserIDs: [3]
    }
];

// Function to format date and time in a friendly way
const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleDateString('sv-SE', options);
};

// --- SVG ICONS ---
// A collection of simple SVG icons to be used in the app, avoiding external dependencies.
const Icons = {
    home: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>),
    calendar: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>),
    user: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>),
    plus: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>),
    arrowLeft: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>),
    logOut: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>),
    users: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
    mapPin: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
    clock: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>),
    // Category specific icons
    fika: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"></path><path d="M17 5v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path><path d="M5 15h2"></path><path d="M5 11h2"></path><path d="M5 7h2"></path></svg>),
    walk: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2.8a2 2 0 0 0-2.8 0L3 12.4l1.4 1.4L8 10.2V18h2v-5.4l2.6 2.6 1.4-1.4Z"></path><path d="m7.4 12.6 1.8-1.8L13 14.6V18h2v-3.8l-3.8-3.8-1.8 1.8-2.2-2.2"></path><circle cx="18" cy="4" r="2"></circle></svg>),
    cinema: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"></rect><path d="M3 12h18"></path><path d="M12 6v12"></path></svg>),
    sports: (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m7 13 3 3 7-7"></path></svg>)
};

const getCategoryIcon = (category) => {
    const iconKey = category.toLowerCase();
    const IconComponent = Icons[iconKey] || Icons.calendar; // Default icon
    return <IconComponent className="h-6 w-6" />;
};


// --- REUSABLE UI COMPONENTS ---

// A gradient button styled like the login button in the inspiration image.
const GradientButton = ({ onClick, children, className = '', type = "button" }) => (
    <button
        type={type}
        onClick={onClick}
        className={`w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-blue-500 via-orange-400 to-teal-400 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all duration-300 shadow-lg ${className}`}
    >
        {children}
    </button>
);

// A container that mimics the look of a mobile phone screen.
const PhoneShell = ({ children }) => (
    <div className="bg-slate-800 p-2 sm:p-4 rounded-3xl shadow-2xl">
        <div className="bg-slate-600 w-24 h-1.5 mx-auto rounded-b-lg"></div>
        <div className="w-full max-w-sm mx-auto bg-gray-50 font-sans rounded-2xl overflow-hidden shadow-inner" style={{ height: 'calc(100vh - 4rem)', maxHeight: '800px' }}>
            <div className="h-full flex flex-col">
                {children}
            </div>
        </div>
    </div>
);

// The bottom navigation bar for switching main screens.
const BottomNav = ({ activeView, onNavigate }) => {
    const navItems = [
        { view: 'home', icon: Icons.home, label: 'Evenemang' },
        { view: 'my-events', icon: Icons.calendar, label: 'Mina evenemang' },
        { view: 'profile', icon: Icons.user, label: 'Profil' }
    ];

    return (
        <div className="flex justify-around items-center p-2 bg-white border-t border-gray-200 mt-auto">
            {navItems.map(item => {
                const isActive = activeView === item.view;
                return (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-orange-400'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

// --- SCREEN COMPONENTS ---

// Onboarding/Login Screen
const LoginScreen = ({ users, onLogin, onNavigate }) => {
    const [selectedUserId, setSelectedUserId] = useState(users[0]?.userID || '');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = USERS.find(u => u.userID === parseInt(selectedUserId));
        if (user) {
            onLogin(user);
        }
    };
    
    return (
        <div className="h-full flex flex-col justify-center items-center bg-gray-100 p-8 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to top right, #e0f2fe, #fff7ed, #f0fdfa)'}}>
            <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-500 via-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Hänga Med
                </span>
            </h1>
            <p className="text-gray-600 mb-8 text-center">Hitta och skapa avslappnade evenemang i din stad.</p>
            
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                <p className="text-sm text-gray-700 text-center font-semibold">Välj en användare att logga in med (prototyp):</p>
                <select 
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    {users.map(user => <option key={user.userID} value={user.userID}>{user.name}</option>)}
                </select>
                <GradientButton type="submit">Logga in</GradientButton>
            </form>
             <button onClick={() => onNavigate('signup')} className="text-sm text-gray-500 mt-4 hover:underline">Skapa konto</button>
        </div>
    );
};

// Sign Up Screen
const SignUpScreen = ({ onSignUp, onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        // Basic validation
        if (name.trim() && email.trim()) {
            onSignUp({ name, email });
        }
    };

    return (
        <div className="h-full flex flex-col justify-center items-center bg-gray-100 p-8 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to top right, #e0f2fe, #fff7ed, #f0fdfa)'}}>
            <h1 className="text-4xl font-bold mb-4">
                 <span className="bg-gradient-to-r from-blue-500 via-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Gå med oss
                </span>
            </h1>
            <p className="text-gray-600 mb-8 text-center">Skapa ditt konto för att börja.</p>
            
            <form onSubmit={handleSignUp} className="w-full max-w-xs space-y-4">
                 <div>
                    <input type="text" placeholder="Ditt namn" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                    <input type="email" placeholder="Din e-post" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                 {/* Dummy password field for UI completeness */}
                <div>
                     <input type="password" placeholder="Lösenord" required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <GradientButton type="submit">Skapa konto</GradientButton>
            </form>
            <button onClick={() => onNavigate('login')} className="text-sm text-gray-500 mt-4 hover:underline">Har du redan ett konto? Logga in</button>
        </div>
    );
};


// Home Screen: Displays a list of available events
const HomeScreen = ({ events, onNavigate, currentUser }) => {
    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        <span className="bg-gradient-to-r from-blue-500 via-orange-400 to-teal-400 bg-clip-text text-transparent">Hänga Med</span>
                    </h1>
                     <button onClick={() => onNavigate('create')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Icons.plus className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <p className="text-gray-500 mt-1">Hej {currentUser.name}, hitta något att göra!</p>
            </header>
            <main className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
                {events.map(event => (
                    <div key={event.eventID} onClick={() => onNavigate('details', event.eventID)} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-orange-200 transition-all">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 text-orange-500 rounded-lg">
                                {getCategoryIcon(event.category)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.category}</p>
                                <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                    <Icons.clock className="w-3 h-3" />
                                    <span>{formatDateTime(event.dateTime)}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Icons.users className="w-4 h-4 mr-1" />
                                <span>{event.attendeeUserIDs.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

// Event Details Screen
const EventDetailsScreen = ({ eventId, events, users, currentUser, onJoin, onNavigate }) => {
    const event = events.find(e => e.eventID === eventId);
    if (!event) return <div className="p-4">Evenemanget hittades inte.</div>;

    const creator = users.find(u => u.userID === event.creatorUserID);
    const attendees = event.attendeeUserIDs.map(id => users.find(u => u.userID === id));
    const hasJoined = event.attendeeUserIDs.includes(currentUser.userID);

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 flex items-center gap-4 border-b border-gray-200 bg-white">
                <button onClick={() => onNavigate('home')} className="p-2 rounded-full hover:bg-gray-100">
                    <Icons.arrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Evenemangsdetaljer</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4 bg-gray-50">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 text-orange-500 rounded-lg mt-1">
                            {getCategoryIcon(event.category)}
                        </div>
                        <div>
                            <p className="text-sm text-orange-600 font-semibold">{event.category}</p>
                            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                        </div>
                    </div>
                    
                    <p className="text-gray-600">{event.description}</p>
                    
                    <div className="space-y-3 pt-2 text-gray-700">
                        <div className="flex items-center gap-3">
                            <Icons.clock className="w-5 h-5 text-gray-400" />
                            <span>{formatDateTime(event.dateTime)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Icons.mapPin className="w-5 h-5 text-gray-400" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Icons.user className="w-5 h-5 text-gray-400" />
                            <span>Skapad av <strong>{creator?.name || 'Okänd'}</strong></span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2 text-gray-800">Vem kommer? ({attendees.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {attendees.map(attendee => (
                                <div key={attendee.userID} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {attendee.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="p-4 bg-white border-t border-gray-200">
                <GradientButton onClick={() => onJoin(event.eventID)} disabled={hasJoined} className={hasJoined ? 'opacity-50 cursor-not-allowed' : ''}>
                    {hasJoined ? 'Du har gått med!' : 'Gå med i evenemang'}
                </GradientButton>
            </footer>
        </div>
    );
};

// Create Event Screen
const CreateEventScreen = ({ currentUser, onCreate, onNavigate }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Fika');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = {
            eventID: Date.now(), // simple unique ID
            title,
            description,
            category,
            location,
            dateTime: `${date}T${time}:00`,
            creatorUserID: currentUser.userID,
            attendeeUserIDs: [currentUser.userID]
        };
        onCreate(newEvent);
    };
    
    return (
        <div className="flex flex-col h-full">
            <header className="p-4 flex items-center gap-4 border-b border-gray-200 bg-white">
                <button onClick={() => onNavigate('home')} className="p-2 rounded-full hover:bg-gray-100">
                    <Icons.arrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Skapa nytt evenemang</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4 bg-gray-50">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Titel</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Kategori</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                            <option>Fika</option>
                            <option>Walk</option>
                            <option>Cinema</option>
                            <option>Sports</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Plats</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Datum</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                        <div className="flex-1">
                             <label className="text-sm font-medium text-gray-700">Tid</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Beskrivning</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="4" className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"></textarea>
                    </div>
                     <div className="pt-2">
                         <GradientButton type="submit">Skapa evenemang</GradientButton>
                    </div>
                </form>
            </main>
        </div>
    );
};

// My Events Screen
const MyEventsScreen = ({ events, currentUser, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('joined');
    
    const joinedEvents = events.filter(e => e.attendeeUserIDs.includes(currentUser.userID));
    const createdEvents = events.filter(e => e.creatorUserID === currentUser.userID);
    
    const eventsToShow = activeTab === 'joined' ? joinedEvents : createdEvents;

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-800">Mina evenemang</h1>
                <div className="mt-4 flex border-b">
                    <button onClick={() => setActiveTab('joined')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'joined' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}>
                        Anmäld ({joinedEvents.length})
                    </button>
                    <button onClick={() => setActiveTab('created')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'created' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}>
                        Skapade ({createdEvents.length})
                    </button>
                </div>
            </header>
             <main className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
                {eventsToShow.length > 0 ? (
                    eventsToShow.map(event => (
                       <div key={event.eventID} onClick={() => onNavigate('details', event.eventID)} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-orange-200 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-100 text-orange-500 rounded-lg">
                                    {getCategoryIcon(event.category)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.category}</p>
                                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                        <Icons.clock className="w-3 h-3" />
                                        <span>{formatDateTime(event.dateTime)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Icons.users className="w-4 h-4 mr-1" />
                                    <span>{event.attendeeUserIDs.length}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        <p>Inga evenemang här.</p>
                        <p className="text-sm">{activeTab === 'joined' ? 'Gå med i evenemang för att se dem här!' : 'Skapa ett evenemang för att komma igång!'}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// User Profile Screen
const ProfileScreen = ({ currentUser, onLogout }) => {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
            </header>
            <main className="flex-grow p-4 flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-white text-4xl font-bold">
                    {currentUser.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                <p className="text-gray-500">{currentUser.email}</p>
                <button onClick={onLogout} className="mt-8 flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-500 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                    <Icons.logOut className="w-5 h-5" />
                    <span>Logga ut</span>
                </button>
            </main>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

function App() {
    // State management for the entire application
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(USERS);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [view, setView] = useState({ name: 'login', payload: null }); // name: 'login', 'signup', 'home', etc.

    // --- Handlers for state changes ---

    const handleLogin = (user) => {
        setCurrentUser(user);
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setView({ name: 'login', payload: null });
    };

    const handleNavigate = (viewName, payload = null) => {
        setView({ name: viewName, payload });
    };
    
    const handleCreateEvent = (newEvent) => {
        setEvents([newEvent, ...events]);
        handleNavigate('home');
    };
    
    const handleJoinEvent = (eventId) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.eventID === eventId && !event.attendeeUserIDs.includes(currentUser.userID)) {
                return { ...event, attendeeUserIDs: [...event.attendeeUserIDs, currentUser.userID] };
            }
            return event;
        }));
    };

    const handleSignUp = (newUserData) => {
        const newUser = {
            ...newUserData,
            userID: users.length + 1 + Date.now(), // simple unique ID
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser); // Automatically log in
        setView({ name: 'home', payload: null });
    };

    // --- Render logic for the current view ---

    const renderView = () => {
        // Handle views for logged-out users
        if (!currentUser) {
            switch(view.name) {
                case 'signup':
                    return <SignUpScreen onSignUp={handleSignUp} onNavigate={handleNavigate} />;
                default: // 'login'
                    return <LoginScreen users={users} onLogin={handleLogin} onNavigate={handleNavigate} />;
            }
        }
        
        // Main content area that switches between screens for logged-in users
        let mainContent;
        switch (view.name) {
            case 'details':
                mainContent = <EventDetailsScreen eventId={view.payload} events={events} users={users} currentUser={currentUser} onJoin={handleJoinEvent} onNavigate={handleNavigate} />;
                break;
            case 'create':
                mainContent = <CreateEventScreen currentUser={currentUser} onCreate={handleCreateEvent} onNavigate={handleNavigate} />;
                break;
            case 'my-events':
                mainContent = <MyEventsScreen events={events} currentUser={currentUser} onNavigate={handleNavigate} />;
                break;
            case 'profile':
                mainContent = <ProfileScreen currentUser={currentUser} onLogout={handleLogout} />;
                break;
            default: // 'home'
                mainContent = <HomeScreen events={events} onNavigate={handleNavigate} currentUser={currentUser} />;
        }

        // Show main content with the bottom navigation bar
        const showBottomNav = ['home', 'my-events', 'profile'].includes(view.name);
        
        return (
            <div className="h-full flex flex-col">
                <div className="flex-grow overflow-hidden">
                    {mainContent}
                </div>
                {showBottomNav && <BottomNav activeView={view.name} onNavigate={handleNavigate} />}
            </div>
        );
    };

    return (
        <div className="bg-gray-200 min-h-screen flex items-center justify-center p-2 sm:p-4">
            <PhoneShell>
                {renderView()}
            </PhoneShell>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

