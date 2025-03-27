// Auth0 configuration
const auth0 = new Auth0Client({
    domain: 'dev-abc123.auth0.com', // Replace with your Auth0 domain
    client_id: 'abc123def456',      // Replace with your Auth0 client ID
    redirect_uri: window.location.origin,
    audience: 'https://ecotrack-api.example.com'
});

// Login function
async function login() {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin,
        screen_hint: 'login'
    });
}

// Signup function
async function signup() {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin,
        screen_hint: 'signup'
    });
}

// Logout function
async function logout() {
    await auth0.logout({
        returnTo: window.location.origin
    });
}

// Check authentication status
async function checkAuth() {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        // User is logged in
        const user = await auth0.getUser();
        updateUIForLoggedInUser(user);
    } else {
        // User is not logged in
        updateUIForGuest();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('signup-btn').style.display = 'none';
    document.getElementById('profile-btn').style.display = 'flex';
    document.getElementById('logout-btn').style.display = 'block';
    document.getElementById('user-profile-section').style.display = 'block';
    
    // Update user profile in navbar
    const profileElement = document.getElementById('user-profile');
    profileElement.innerHTML = `
        <img src="${user.picture || 'https://via.placeholder.com/100'}" alt="Profile" class="w-8 h-8 rounded-full">
        <span class="ml-2 hidden md:inline">${user.name || 'User'}</span>
    `;
    
    // Update profile section
    document.getElementById('profile-picture').src = user.picture || 'https://via.placeholder.com/100';
    document.getElementById('profile-name').textContent = user.name || 'User';
    document.getElementById('profile-email').textContent = user.email || '';
}

// Update UI for guest
function updateUIForGuest() {
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('signup-btn').style.display = 'block';
    document.getElementById('profile-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('user-profile-section').style.display = 'none';
}

// Initialize auth when page loads
window.addEventListener('load', async () => {
    await checkAuth();
    
    // Handle auth callback if needed
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
        await checkAuth();
    }
});

// Expose functions to window for button clicks
window.login = login;
window.signup = signup;
window.logout = logout;