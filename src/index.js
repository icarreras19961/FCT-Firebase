import { initializeApp } from "firebase/app"; // el import de 1 funcion del firebase
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  //Condiciones de las queries
  where,
  orderBy,
  //--//
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOQ9aJbxdjBzyPe62Ifrzs8s9OHukR8Ms",
  authDomain: "net-ninja-firebase-9dea9.firebaseapp.com",
  projectId: "net-ninja-firebase-9dea9",
  storageBucket: "net-ninja-firebase-9dea9.appspot.com",
  messagingSenderId: "1015242930227",
  appId: "1:1015242930227:web:0b9ed297ce150d065f0b46",
  measurementId: "G-GK6J9YCXLQ",
};

//Init firebase app
//Utilizando la funcion para llamar al backend del objeto
initializeApp(firebaseConfig);

//init services
//el db representa la conexion entre la base de datos es decir que para pedir informacion o interactuar con la db utilizaremos ensta constante
const db = getFirestore();
//Permite hacer cosas como log in log out
const auth = getAuth();

//Collection ref
//almacena la info de la tabla de la db con nombre de la variable
const colRef = collection(db, "books");

//queries
//un select sql
const q = query(colRef, /*  where("Author", "==", "Me"),*/ orderBy("createAt"));

// real doc get collection data
getDocs(colRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      //mete la info del snapshot dentro del array de books de una manera bonita(doc es algo parecido a la query de select)
      books.push({ ...doc.data(), id: doc.id });
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

//se disparara cada vez que haya un cambio en el coref
//se disparara cuando la condicio de la query q se cumpla
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    //mete la info del snapshot dentro del array de books de una manera bonita(doc es algo parecido a la query de select)
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//adding documents
const addBookFrom = document.querySelector(".add");
addBookFrom.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    //Coge el valor del titulo y lo asigna en el objeto
    Title: addBookFrom.title.value,
    Author: addBookFrom.author.value,
    createAt: serverTimestamp(),
  }).then(() => {
    //para resetear los valores del form
    addBookFrom.reset();
  });
});

//deleting documents
const deleteBookFrom = document.querySelector(".delete");
deleteBookFrom.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookFrom.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookFrom.reset();
  });
});

//get a single document
const docRef = doc(db, "books", "LRsVwcnPz97w3x8TQ8Lc");
/*
getDoc(docRef).then((doc) => {
  console.log(doc.data(), doc.id);
});
*/
//lo mismo que arriba pero en tiempo real
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

//Updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, { Title: updateForm.new_title.value }).then(() => {
    updateForm.reset();
  });
});

//signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User created: ", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("the user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User logged in: ", cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
//el user es el que se registra o entra a la pagina
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("User status changed: ", user);
});

//unssubscribing from changes
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  //Son constantes para salir (estan declaradas arriba)
  unsubCol();
  unsubDoc();
  unsubAuth();
});
