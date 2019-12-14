let user; // Currently authenticated user (supervisor)
let db; // Firebase cloud firestore
let storage; // Firebase GCP Bucket

// Wait for the DOM to load. (Where the firebase libs are)
document.addEventListener("DOMContentLoaded", () => {
    db = firebase.firestore();
    storage = firebase.storage();

    if (!firebase.apps.length) {
        firebase.initializeApp({ // This is all client-side safe.
            apiKey: "AIzaSyDLGdqO7cCBoMWRvUD2Iy8gMVZ-bYUBGbE",
            authDomain: "jonapp-2.firebaseapp.com",
            databaseURL: "https://jonapp-2.firebaseio.com",
            projectId: "jonapp-2",
            storageBucket: "jonapp-2.appspot.com",
            messagingSenderId: "851985231577",
            appId: "1:851985231577:web:67563f2397c4d08dea18c8",
            measurementId: "G-77EKECDTF7"
        });
    }

    firebase.auth().onAuthStateChanged(_user => {
        if (_user) {
            user = _user;
            displaySupervisorBanner();
        } else {
            logIn().then(() => { // Log in and display the banner.
                displaySupervisorBanner();
            });
        }
    });

});

/**
 * Check if a document exists
 * @param docRef Firestore document. For example db.collection("supervisors").doc(user.uid)
 * @return {boolean} Does the doc exist?
 */
function exists(docRef) {
    docRef.get().then(function (doc) {
        return doc.exists;
    });
}


/**
 * Trigger login popup and redirect
 * @return {Promise} login popup completion
 */
function logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider).then(result => {
        user = result.user;

        let supervisor = db.collection("supervisors").doc(user.uid);

        if (!exists(supervisor)) { // If supervisor doesn't exist
            supervisor.set({
                users: [] // Initialize empty users array
            });
        }
    });
}

/**
 * Log out current user
 * @returns {Promise} logout completion
 */
function logOut() {
    return firebase.auth().signOut();
}

/**
 * Trigger a modal popup.
 * @param user
 */
function displayUserModal(user) {
    var name = document.getElementById("mName");
    name.innerText = user;
    $("#taskModal").modal(); // Show the modal
}

/**
 * Display supervisor banner
 */
function displaySupervisorBanner() {
    document.getElementById("banner").innerText = "Logged in as " + user.displayName;
}