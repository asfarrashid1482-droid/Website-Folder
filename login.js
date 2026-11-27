var firebaseConfig = {
    apiKey: "AIzaSyCiwfqnnrRNctUeCWDqKJR8v_9bQVDWN8Y",
    authDomain: "loginpage-e11f4.firebaseapp.com",
    projectId: "loginpage-e11f4",
    storageBucket: "loginpage-e11f4.firebasestorage.app",
    messagingSenderId: "735598405919",
    appId: "1:735598405919:web:2d95642b93730b910f282a",
    measurementId: "G-VQ7JCWLC6M"
};

var auth = null;
var currentAuthTab = 'login';

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    if (typeof firebase.auth === 'function') {
        auth = firebase.auth();
    }
}

function openAuthModal() {
    var modal = document.getElementById('auth-modal');
    var card = document.getElementById('auth-modal-card');
    if (!modal || !card) return;

    modal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    var modal = document.getElementById('auth-modal');
    var card = document.getElementById('auth-modal-card');
    if (!modal || !card) return;

    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
    card.classList.add('scale-95');
    card.classList.remove('scale-100');
    setTimeout(function () {
        modal.classList.add('invisible');
    }, 300);
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    currentAuthTab = tab;
    var tabLogin = document.getElementById('tab-login');
    var tabSignup = document.getElementById('tab-signup');
    var submitBtn = document.getElementById('auth-submit-btn');
    var errBox = document.getElementById('auth-error-msg');
    if (errBox) { errBox.classList.add('hidden'); }

    if (tab === 'signup') {
        tabSignup.className = 'flex-1 pb-3 text-center font-label-lg text-sm text-primary border-b-2 border-primary font-bold transition-all';
        tabLogin.className = 'flex-1 pb-3 text-center font-label-lg text-sm text-on-surface-variant hover:text-primary transition-all';
        submitBtn.textContent = 'Create Account';
    } else {
        tabLogin.className = 'flex-1 pb-3 text-center font-label-lg text-sm text-primary border-b-2 border-primary font-bold transition-all';
        tabSignup.className = 'flex-1 pb-3 text-center font-label-lg text-sm text-on-surface-variant hover:text-primary transition-all';
        submitBtn.textContent = 'Sign In';
    }
}

function showAuthError(msg) {
    var errBox = document.getElementById('auth-error-msg');
    if (errBox) {
        errBox.textContent = msg;
        errBox.classList.remove('hidden');
    }
}

function handleAuthSubmit(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (!auth) {
        alert('Authentication service is initializing. Please try again.');
        return false;
    }

    var email = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;
    var errBox = document.getElementById('auth-error-msg');
    if (errBox) { errBox.classList.add('hidden'); }

    if (currentAuthTab === 'signup') {
        auth.createUserWithEmailAndPassword(email, password)
            .then(function () {
                closeAuthModal();
            })
            .catch(function (err) {
                showAuthError(err.message || 'Error creating account.');
            });
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then(function () {
                closeAuthModal();
            })
            .catch(function (err) {
                showAuthError(err.message || 'Invalid email or password.');
            });
    }
    return false;
}

function handleGoogleSignIn() {
    if (!auth) return;
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(function () {
            closeAuthModal();
        })
        .catch(function (err) {
            showAuthError(err.message || 'Google sign in was canceled or failed.');
        });
}

function handleSignOut() {
    if (!auth) return;
    auth.signOut().then(function () {
        closeAuthModal();
    });
}

if (auth) {
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAuthModal();
        }
    });

    auth.onAuthStateChanged(function (user) {
        var headerLabel = document.getElementById('header-user-label');
        var mobileLabel = document.getElementById('mobile-user-label');
        var formContainer = document.getElementById('auth-form-container');
        var profileContainer = document.getElementById('auth-profile-container');
        var userEmailEl = document.getElementById('auth-user-email');

        if (user) {
            var displayName = user.displayName || user.email.split('@')[0];
            if (headerLabel) { headerLabel.textContent = displayName; }
            if (mobileLabel) { mobileLabel.textContent = displayName + ' (Account)'; }
            if (formContainer) { formContainer.classList.add('hidden'); }
            if (profileContainer) { profileContainer.classList.remove('hidden'); }
            if (userEmailEl) { userEmailEl.textContent = user.email; }
        } else {
            if (headerLabel) { headerLabel.textContent = 'Sign In'; }
            if (mobileLabel) { mobileLabel.textContent = 'Sign In / Register'; }
            if (formContainer) { formContainer.classList.remove('hidden'); }
            if (profileContainer) { profileContainer.classList.add('hidden'); }
        }
    });
}
