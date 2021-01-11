import React from "react";
import Header from "../Components/Header";
import { useHistory } from "react-router-dom";
import "firebase/firestore";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import GameObject, { gameConverter } from "../Models/GameObject.js";

function Home() {
	const history = useHistory();
	const gamesRef = firebase.firestore().collection("games");

	const createGame = () => {
		// TODO: Implement security (multiple game creations... maybe captcha, maybe prevent multiple games in a set period of time)
		let newGame = GameObject.create();
		gamesRef
			.withConverter(gameConverter)
			.add(newGame)
			.then(() => {
				// TODO: Implement collision checking
				redirectToGame(newGame.code);
			});
	};

	const redirectToGame = (gameCode) => {
		history.push(`game?code=${gameCode}`);
	};

	return (
		<React.Fragment>
			<div style={containerStyle}>
				<Header
					title="TicTacToe"
					subtitle="A simple TicTacToe game ..."
				/>
				<div>
					<button style={buttonStyle("#0654be")} onClick={createGame}>
						Start Game
					</button>

					<Link to="/joinGame">
						<button style={buttonStyle("#f4701a")}>
							Join Game
						</button>
					</Link>
				</div>
			</div>
		</React.Fragment>
	);
}

const containerStyle = {
	display: "flex",
	textAlign: "center",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	height: "100vh",
	backgroundColor: "#0d1019",
	color: "white",
};

function buttonStyle(bgColor) {
	return {
		backgroundColor: bgColor,
		border: "none",
		padding: "10px 20px",
		borderRadius: "10px",
		color: "white",
		width: "200px",
		height: "40px",
		margin: "50px 10px",
		fontWeight: "bold",
		cursor: "pointer",
	};
}

export default Home;
