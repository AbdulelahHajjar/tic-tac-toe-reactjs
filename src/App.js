import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Pages/Home.js";
import JoinGame from "./Pages/JoinGame";
import Game from "./Pages/Game";
import firebase from "firebase/app";
import "firebase/firestore";

if (!firebase.apps.length) {
	firebase.initializeApp({
		apiKey: "AIzaSyALW5L-H15RpdxPxe1NZmtnmRfsBKxOALE",
		authDomain: "tictactoe-abdulelah-hajjar.firebaseapp.com",
		projectId: "tictactoe-abdulelah-hajjar",
		storageBucket: "tictactoe-abdulelah-hajjar.appspot.com",
		messagingSenderId: "542282467708",
		appId: "1:542282467708:web:7cb5e1eef59bcbc8177cf9",
	});
} else {
	firebase.app(); // if already initialized, use that one
}

function App() {
	return (
		<Router>
			<Route exact path="/" component={Home} />
			<Route exact path="/joinGame" component={JoinGame} />
			<Route path="/game" component={Game} />
		</Router>
	);
}

export default App;

/*
  Home
    - Create game with a Code
  Game
    - The game
*/
