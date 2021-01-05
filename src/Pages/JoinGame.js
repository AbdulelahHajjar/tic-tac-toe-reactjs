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
			.get()
			.then((querySnapshot) => {
				if (
					querySnapshot != null &&
					querySnapshot.size > 0 &&
					querySnapshot.docs[0] != null &&
					querySnapshot.docs[0].exists
					/* // TODO: && either x or o is null. */
				) {
					redirectToGame(gameCode);
				} else {
					// TODO: display error
				}
			});
	}

	const onGameCodeChange = (e) => {
		setGameCode(e.target.value);
	};

	// TODO: redundant code
	const redirectToGame = (gameCode) => {
		const location = {
			pathname: `game?code=${gameCode}`,
		};
		history.push(location);
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
	textAlign: "center",
	flexDirection: "column",
};

export default JoinGame;
