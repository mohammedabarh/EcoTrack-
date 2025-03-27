// Dashboard Script - Complete Implementation

// DOM Elements
const getStartedBtn = document.getElementById('get-started-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const profileBtn = document.getElementById('profile-btn');
const signupModal = document.getElementById('signup-modal');
const closeModal = document.getElementById('close-modal');
const showLogin = document.getElementById('show-login');
const signupForm = document.getElementById('signup-form');
const userProfileSection = document.getElementById('user-profile-section');

// Auth Functions
async function login() {
  try {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
      screen_hint: 'login' // Explicitly show login screen
    });
  } catch (error) {
    console.error('Login error:', error);
    alert('Failed to initiate login. Please try again.');
  }
}

async function logout() {
  try {
    await auth0.logout({
      returnTo: window.location.origin
    });
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout. Please try again.');
  }
}

// Update UI based on auth state
function updateUIForLoggedInUser(user) {
  // Show/hide auth buttons
  loginBtn.style.display = 'none';
  signupBtn.style.display = 'none';
  profileBtn.style.display = 'block';
  logoutBtn.style.display = 'block';

  // Update navbar profile
  const profileElement = document.getElementById('user-profile');
  profileElement.innerHTML = `
    <img src="${user.picture || 'https://via.placeholder.com/100'}" 
         alt="Profile" 
         class="w-8 h-8 rounded-full">
    <span class="ml-2">${user.name || 'User'}</span>
  `;

  // Show user profile section
  userProfileSection.classList.remove('hidden');
  document.getElementById('user-avatar').src = user.picture || 'https://via.placeholder.com/100';
  document.getElementById('user-name').textContent = user.name || 'User';
  document.getElementById('user-email').textContent = user.email || '';

  // Enable dashboard features
  enableDashboardFeatures();
}

function updateUIForGuest() {
  // Show/hide auth buttons
  loginBtn.style.display = 'block';
  signupBtn.style.display = 'block';
  profileBtn.style.display = 'none';
  logoutBtn.style.display = 'none';

  // Hide user profile section
  userProfileSection.classList.add('hidden');

  // Disable sensitive dashboard features
  disableGuestFeatures();
}

// Dashboard Feature Toggles
function enableDashboardFeatures() {
  // Enable all interactive elements
  document.querySelectorAll('[data-auth-only]').forEach(el => {
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
  });
}

function disableGuestFeatures() {
  // Dim and disable auth-only elements
  document.querySelectorAll('[data-auth-only]').forEach(el => {
    el.style.opacity = '0.6';
    el.style.pointerEvents = 'none';
  });
}

// Modal Functions
function openSignupModal() {
  signupModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeSignupModal() {
  signupModal.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Form Handling
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Basic validation
  if (!name || !email || !password) {
    alert('Please fill in all fields');
    return;
  }

  if (password.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }

  try {
    // In a real app, you would send this to your backend
    console.log('Signup data:', { name, email, password });
    
    // For demo purposes, we'll proceed with Auth0 login
    closeSignupModal();
    await login();
  } catch (error) {
    console.error('Signup error:', error);
    alert('Failed to sign up. Please try again.');
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.stat-card, .glass-card, section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// Event Listeners
function setupEventListeners() {
  // Auth buttons
  getStartedBtn.addEventListener('click', openSignupModal);
  loginBtn.addEventListener('click', login);
  signupBtn.addEventListener('click', openSignupModal);
  logoutBtn.addEventListener('click', logout);
  
  // Modal controls
  closeModal.addEventListener('click', closeSignupModal);
  showLogin.addEventListener('click', () => {
    closeSignupModal();
    login();
  });
  
  // Form submission
  signupForm.addEventListener('submit', handleSignup);
  
  // Close modal when clicking outside
  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      closeSignupModal();
    }
  });
}

// Initialize Dashboard
async function initializeDashboard() {
  try {
    // Check auth status
    const isAuthenticated = await auth0.isAuthenticated();
    
    if (isAuthenticated) {
      const user = await auth0.getUser();
      updateUIForLoggedInUser(user);
    } else {
      updateUIForGuest();
    }

    // Handle auth callback if present in URL
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
      const user = await auth0.getUser();
      updateUIForLoggedInUser(user);
    }
  } catch (error) {
    console.error('Initialization error:', error);
    updateUIForGuest();
  }

  // Setup animations and event listeners
  setupScrollAnimations();
  setupEventListeners();
}

// Start the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);