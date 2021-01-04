import { useHistory } from "react-router-dom";
import { useState } from "react";
import Header from "../Components/Header";
import "firebase/firestore";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

function JoinGame() {
	const [boardCode, setBoardCode] = useState("");
	const history = useHistory();
	const [uid, setUid] = useState(uuidv4());

	function openBoardWithCode() {
		const boardsRef = firebase.firestore().collection("boards");

		boardsRef
			.where("code", "==", boardCode)
			.get()
			.then((querySnapshot) => {
				const exists = querySnapshot.docs[0].exists;
				if (exists) {
					boardsRef
						.doc(querySnapshot.docs[0].id)
						.update({ o: uid })
						.then(() => {
							history.push(`board?code=${boardCode}`);
						});
				} else {
					// todo display error
				}
			});
	}

	const _setBoardCode = (e) => {
		setBoardCode(e.target.value);
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
				onChange={_setBoardCode}
			/>

			<br />
			<button style={buttonStyle()} onClick={openBoardWithCode}>
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
