import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";
import { gameConverter } from "../Models/GameObject";
import { v4 as uuidv4 } from "uuid";

var listener = null;

function Game(props) {
	const gamesRef = firebase.firestore().collection("games");
	const [game, setGame] = useState(null);
	const uid = uuidv4();

	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}

	const code = useQuery().get("code");

	useEffect(
		() => {
			attachGameListener();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[] /*<-Understand this issue*/
	);

	const attachGameListener = () => {
		if (listener) return;
		listener = gamesRef
			.where("code", "==", code)
			.onSnapshot((querySnapshot) => {
				if (querySnapshot != null && querySnapshot.size > 0) {
					let gameObj = gameConverter.fromFirestore(
						querySnapshot.docs[0],
						querySnapshot.docs[0].options
					);

					// TODO: Prevent setting game when a player is missing
					setGame(gameObj);
				} else {
					//TODO: Display error (implement catch method if possible)
				}
			});
	};

	const makePlay = (index) => {
		// TODO: Implement better id technique
		// FIXME: no uid in state anymore
		if (!game.canMakeMove(uid, index)) return;

		game.makeMove(index);
		if (game.existsWinner()) {
			console.log(game.currentPlayer + " Won!!!");
			// TODO: Display prompt
		}

		gamesRef
			.doc(game.id)
			.update({ board: game.board, currentPlayer: game.nextPlayer() });
	};

	// TODO: Fix blank screen on first launch of this page
	if (game != null) {
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
