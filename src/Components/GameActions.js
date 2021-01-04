import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router-dom";
import "firebase/firestore";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

function GameActions() {
	const history = useHistory();
	const [uid, setUid] = useState(uuidv4());

	// TODO: Implement collision checking
	const generateGameCode = () => {
		var result = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < 6; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	};

	const createGame = () => {
		const gameCode = generateGameCode();
		firebase
			.firestore()
			.collection("games")
			.add({
				code: gameCode,
				x: uid,
				turn: uid,
				board: Array(9).fill(null),
			})
			.then(() => {
				const location = {
					pathname: `game?code=${gameCode}`,
					state: { uid },
				};
				history.push(location);
			});
	};

	return (
		<div>
			<button style={buttonStyle("#0654be")} onClick={createGame}>
				Start Game
			</button>

			<Link to="/joinGame">
				<button style={buttonStyle("#f4701a")}>Join Game</button>
			</Link>
		</div>
	);
}

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

export default GameActions;
