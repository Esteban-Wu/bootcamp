import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { BrowserRouter } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import {
    ReactReduxFirebaseProvider,
    firebaseReducer
} from 'react-redux-firebase';
import { composeWithDevTools } from "redux-devtools-extension";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA7IQlSd9bF0zSkQT7FhC8Dr5tZZk1CqSE",
    authDomain: "bootcamp-3d823.firebaseapp.com",
    databaseURL: "https://bootcamp-3d823-default-rtdb.firebaseio.com",
    projectId: "bootcamp-3d823",
    storageBucket: "bootcamp-3d823.appspot.com",
    messagingSenderId: "205740495839",
    appId: "1:205740495839:web:3d9f6e5e73a70bf3662a6a",
    measurementId: "G-LR75SZCL0F"
};

firebase.initializeApp(firebaseConfig);
firebase.functions().useEmulator("localhost", 5001);

// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    // firestore: firestoreReducer // <- needed if using firestore
});

// Create store with reducers and add dev tools
const store = createStore(rootReducer, composeWithDevTools());

// react-redux-firebase config
const rrfConfig = {
    preserveOnLogout: ["homepage"], // included to preserve info on logout
    userProfile: "users",
    // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
    // enableClaims: true // Get custom claims along with the profile
};

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    // createFirestoreInstance // <- needed if using firestore
};

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ReactReduxFirebaseProvider>
    </Provider>,
    document.getElementById("root"),
);

