const firebaseConfiguration = {
    apiKey: "AIzaSyAIYrYKjJ5llB65nfW-ZeArOulMRVVV3Ys",
    authDomain: "compu-meeting.firebaseapp.com",
    databaseURL: "https://compu-meeting.firebaseio.com",
    projectId: "compu-meeting",
    storageBucket: "compu-meeting.appspot.com",
    messagingSenderId: "851561321726",
    appId: "1:851561321726:web:d72b140bc0b6446262c1af",
    measurementId: "G-5ZYCLRPCWQ"
};

let messagesRef;
let user_uid_firebase;
firebase.initializeApp(firebaseConfiguration);
let database = firebase.database();

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        user_uid_firebase = user.uid;
        // pageAuth(user.email, user.displayName);
    }else{
        // pageNoAuth();
    }
});

const addUserToChatRoom = async(room) => {
    messagesRef = database.ref('/webrtc/' + room);
    messagesRef.on('child_added', (data) => {
        if(data.val().uid != user_uid_firebase){
            addMessage(data.val().uid, data.val().message);
        }
    });      
}

const newMessage = (message) => {
    let newMessage = messagesRef.push({ uid : user_uid_firebase, message : message });
    newMessage.remove();
}

const uploadFirebaseFile = (file) => {
    let counter = 0;
    let storage = firebase.storage().ref(file.name);
    let upload = storage.put(file);
    upload.on("state_changed",
        (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateProgressValue(percentage);
        },
        (error) => {
            hideProgressBar();
        },
        () => {
            hideProgressBar();
            storage.getDownloadURL().then(function(url) {
                newMessage(`<a href="${url}" download>${file.name}</a>`);
                let liMessage = document.createElement('li');
                liMessage.className = 'enviado';
                document.querySelector('#chat-container').appendChild(liMessage);
                let pMessage = document.createElement('p');
                pMessage.innerHTML = `<a href="${url}" download>${file.name}</a>`;
                liMessage.appendChild(pMessage);
                document.querySelector('.scroll-chat').scrollTop =  document.querySelector('.scroll-chat').scrollHeight;
            }).catch(function(error) {
                console.log(error);
            });
        }
    );
}