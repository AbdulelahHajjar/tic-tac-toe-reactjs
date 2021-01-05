import React from "react";
import Header from "../Components/Header";
import { useHistory } from "react-router-dom";
import "firebase/firestore";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import { gameConverter, createGameObject } from "../Models/GameObject.js";

function Home() {
	const history = useHistory();
	const gamesRef = firebase.firestore().collection("games");

	// TODO: Implement collision checking
	const createGame = () => {
		let newGame = createGameObject();
		gamesRef
			.withConverter(gameConverter)
			.add(newGame)
			.then(() => {
				redirectToGame(newGame.code);
			});
	};

	const redirectToGame = (gameCode) => {
		const location = {
			pathname: `game?code=${gameCode}`,
		};
		history.push(location);
	};

	return (
		<div style={containerStyle}>
			<Header
				title="TicTacToe"
				subtitle="The simple TicTacToe game you have been looking for..."
			/>
			<button style={buttonStyle("#0654be")} onClick={createGame}>
				Start Game
			</button>

			<Link to="/joinGame">
				<button style={buttonStyle("#f4701a")}>Join Game</button>
			</Link>
		</div>
	);
}

const containerStyle = {
	display: "flex",
	textAlign: "center",
	flexDirection: "column",
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
