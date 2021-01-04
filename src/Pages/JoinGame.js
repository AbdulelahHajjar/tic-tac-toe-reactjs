import { useHistory } from "react-router-dom";
import { useState } from "react";
import Header from "../Components/Header";
import "firebase/firestore";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

function JoinGame() {
	const [gameCode, setGameCode] = useState("");
	const history = useHistory();
	const [uid, setUid] = useState(uuidv4());

	function openGameWithCode() {
		const gamesRef = firebase.firestore().collection("games");

		gamesRef
			.where("code", "==", gameCode)
			.get()
			.then((querySnapshot) => {
				const exists = querySnapshot.docs[0].exists;
				if (exists) {
					gamesRef
						.doc(querySnapshot.docs[0].id)
						.update({ o: uid })
						.then(() => {
							const location = {
								pathname: `game?code=${gameCode}`,
								state: { uid },
							};
							history.push(location);
						});
				} else {
					// todo display error
				}
			});
	}

	const _setGameCode = (e) => {
		setGameCode(e.target.value);
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
				onChange={_setGameCode}
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
