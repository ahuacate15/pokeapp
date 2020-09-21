const firebaseConfig = {
    apiKey: "AIzaSyDS2eV54kuhGt91GkKoWiR7gBDtpvMI0jU",
    authDomain: "pokeapp-83e8e.firebaseapp.com",
    databaseURL: "https://pokeapp-83e8e.firebaseio.com",
    projectId: "pokeapp-83e8e",
    storageBucket: "pokeapp-83e8e.appspot.com",
    messagingSenderId: "649843209856",
    appId: "1:649843209856:web:c37ca2f59f2a149ba15865",
    measurementId: "G-FQCP573PKZ"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;