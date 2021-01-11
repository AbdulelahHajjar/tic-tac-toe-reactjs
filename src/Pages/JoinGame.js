import { useHistory } from "react-router-dom";
import { useState } from "react";
import Header from "../Components/Header";
import "firebase/firestore";
import firebase from "firebase/app";

function JoinGame() {
	const history = useHistory();
	const gamesRef = firebase.firestore().collection("games");

	const [gameCode, setGameCode] = useState("");

	function openGameWithCode() {
		gamesRef
			.where("code", "==", gameCode)
			.where("winner", "==", null)
			.get()
			.then(() => {
				redirectToGame(gameCode);
			});
	}

	const onGameCodeChange = (e) => {
		setGameCode(e.target.value);
	};

	// TODO: redundant code
	const redirectToGame = (gameCode) => {
		history.push(`game?code=${gameCode}`);
	};

	return (
		<div style={containerStyle}>
			<Header
				title="Join Game"
				subtitle="Type in the game code to join a match!"
			/>

			<input
				type="text"
				placeholder="Enter game code..."
				style={textFieldStyle}
				onChange={onGameCodeChange}
			/>

			<br />
			<button style={buttonStyle()} onClick={openGameWithCode}>
				Join Game
			</button>
		</div>
	);
}

const textFieldStyle = {
	padding: "10px",
	fontSize: "24pt",
	marginTop: "36px",
	textAlign: "center",
};

function buttonStyle(bgColor) {
	return {
		backgroundColor: bgColor || "#0654be",
		border: "none",
		padding: "10px 20px",
		borderRadius: "10px",
		color: "white",
		width: "200px",
		height: "40px",
		margin: "10px 10px",
		fontWeight: "bold",
		cursor: "pointer",
	};
}

const containerStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	backgroundColor: "#0d1019",
	height: "100vh",
	color: "white",
};

export default JoinGame;
