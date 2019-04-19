import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import initializeStore from './store/store';
import initializeFirebase from './firebase';
import App from './App';

initializeFirebase();

// const store = initializeStore();

// const app = (
//   <Provider store = {store}>
//     <App />
//   </Provider>
// )

ReactDOM.render(<App />, document.getElementById('root'));
