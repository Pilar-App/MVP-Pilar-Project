
var admin = require("firebase-admin");

var serviceAccount = require(`D:/Jhomar/Pilar/MVP/MVP-Pilar-Project/action-mvp/serviceAccountKey.json`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let cartasCollection = db.collection('Cartas');

cartasCollection.get().then((querySnapshot) => {
    querySnapshot.forEach( document => {
        console.log(document.data());
    })
})

const saveUser = (user) => {
    db.collection("users").add({
        user
    })
    .then(function(docRef){
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error){
        console.error("Error adding document: ", error);
    })
}

const user = {
    name:'Jose',
    age: 23,
    email: 'jose@gmail.com',
}

saveUser(user)