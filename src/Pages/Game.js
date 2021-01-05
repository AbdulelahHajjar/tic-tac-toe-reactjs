import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";
import GameObject from "../Models/GameObject";

var listener = null;

function Game(props) {
	const [game, setGame] = useState(null);

	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}

	const query = useQuery();
	const code = query.get("code");

	useEffect(() => {
		attachGameListener();
	}, []);

	const attachGameListener = () => {
		if (listener) return;
		listener = firebase
			.firestore()
			.collection("games")
			.where("code", "==", code)
			.onSnapshot((querySnapshot) => {
				if (querySnapshot != null && querySnapshot.size > 0) {
					let gameDoc = querySnapshot.docs[0];
					let gameObj = new GameObject(
						gameDoc.id,
						gameDoc.data().code,
						gameDoc.data().x,
						gameDoc.data().o,
						gameDoc.data().currentPlayer,
						gameDoc.data().board
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
		if (!game.canMakeMove(props.location.state.uid, index)) return;

		game.makeMove(index);
		if (game.existsWinner()) {
			console.log(game.currentPlayer + " Won!!!");
			// TODO: Display prompt
		}

		firebase
			.firestore()
			.collection("games")
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
