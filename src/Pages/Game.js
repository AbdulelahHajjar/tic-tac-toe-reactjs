import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";
import GameObject, { gameConverter } from "../Models/GameObject";
import { v4 as uuidv4 } from "uuid";

var listener = null;

function Game() {
	const gamesRef = firebase.firestore().collection("games");
	const [game, setGame] = useState(null);
	const [error, setError] = useState("");
	const [prompt, setPrompt] = useState("");
	var uid = localStorage.getItem("uid");

	if (uid == null) {
		uid = uuidv4();
		localStorage.setItem("uid", uid);
	}

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};

	const code = useQuery().get("code");

	const attachGameListener = () => {
		if (listener) return;
		listener = gamesRef
			.where("code", "==", code)
			.onSnapshot((querySnapshot) => {
				if (querySnapshot != null && querySnapshot.size > 0) {
					let doc = querySnapshot.docs[0];
					let gameObj = new GameObject(
						doc.id,
						doc.data().code,
						doc.data().x,
						doc.data().o,
						doc.data().currentPlayer,
						doc.data().board
					);

					if (gameObj.isContestant(uid)) {
						if (gameObj.x == null || gameObj.o == null) {
							setPrompt("Waiting for other contestant...");
						} else {
							setGame(gameObj);
							setPrompt(null);
							setError(null);
						}
					} else if (gameObj.newContestantCanJoin()) {
						gameObj.addContestant(uid);
						gamesRef
							.doc(gameObj.id)
							.withConverter(gameConverter)
							.set(gameObj);
					} else {
						setError("Error: full lobby.");
					}
				} else {
					setError("Error: cannot get game.");
				}
			});
	};

	useEffect(
		() => {
			attachGameListener();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[] /*<-Understand this issue*/
	);

	const makePlay = (index) => {
		if (!game.canMakeMove(uid, index)) return;

		game.makeMove(index);
		if (game.existsWinner()) {
			setPrompt(game.currentPlayer + " Won!!!");
		}

		gamesRef
			.doc(game.id)
			.update({ board: game.board, currentPlayer: game.nextPlayer() });
	};

	// TODO: Fix blank screen on first launch of this page
	if (prompt == null && error == null && game != null) {
		return (
			<div style={{ width: "600px" }}>
				{game.board.map((square, index) => {
					return (
						<Square
							key={index}
							index={index}
							player={square}
							makePlay={makePlay}
						/>
					);
				})}
			</div>
		);
	} else {
		return (
			<div style={containerStyle}>
				<Header
					title="Waiting for contenstant to join..."
					subtitle={`Game code is ${code}`}
				/>

				<p>{prompt}</p>
				<p>{error}</p>
			</div>
		);
	}
}

const containerStyle = {
	display: "flex",
	textAlign: "center",
	flexDirection: "column",
};

export default Game;
