import {createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';

import {reactReduxFirebase, firebaseReducer} from 'react-redux-firebase';
import {reduxFirestore, firestoreReducer } from 'redux-firestore';

//Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

// import { composeWithDevTools } from 'redux-devtools-extension';
//Reducer
// @todo



const firebaseConfig = {
    apiKey: "AIzaSyCTC3HE3Vp7Xq1zanow8TlecBs_8VOjMLg",
    authDomain: "reactclientpanel-afca2.firebaseapp.com",
    databaseURL: "https://reactclientpanel-afca2.firebaseio.com",
    projectId: "reactclientpanel-afca2",
    storageBucket: "reactclientpanel-afca2.appspot.com",
    messagingSenderId: "141783620440",
    appId: "1:141783620440:web:18b168181d1dce4d55632d",
    measurementId: "G-GRCK09MSWF"
};
// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    userFirestoreForProfile: true //Firestor for profile instead of Realtime DB
};

//Init Firebase instance
firebase.initializeApp(firebaseConfig);
  firebase.analytics();

//Init FireStore
const firestore = firebase.firestore();
const settings = {}; //timestampsInSnapshots: true
firestore.settings(settings);

// Add reactReduxFirestore enhancer when making store creator
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
    reduxFirestore(firebase)
)(createStore);



const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    notify: notifyReducer,
    settings: settingsReducer
});

//Check settings in local storage
if(localStorage.getItem('settings') == null) {
    //Default Settings
    const defaultSettings = {
        disableBalanceOnAdd: true,
        disableBalanceOnEdit: false,
        allowRegistration: false
    };

    //set To local storage
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

//create initial state
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) 
};

//Create Store
const store = createStoreWithFirebase(
    rootReducer, 
    initialState, 
    compose(
        reactReduxFirebase(firebase),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;