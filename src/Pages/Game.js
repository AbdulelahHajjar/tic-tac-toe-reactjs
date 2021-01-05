import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";

var listener = null;

function Game(props) {
	const [game, setGame] = useState(null);

	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}

	const query = useQuery();
	const code = query.get("code");
	var [gameId, setGameId] = useState(null);

	useEffect(() => {
		if (listener) return;
		listener = firebase
			.firestore()
			.collection("games")
			.where("code", "==", code)
			.onSnapshot((documentSnapshot) => {
				//TODO: check if game exists.
				setGame(documentSnapshot.docs[0].data());
				setGameId(documentSnapshot.docs[0].id);
			});
	}, []);

	const makePlay = (index) => {
		if (game.turn != props.location.state.uid) return;
		// TODO: check if player string is null
		game.board[index] = getPlayerString(props.location.state.uid);

		let didWin = checkWinner();

		if (didWin) {
			console.log(getPlayerString(props.location.state.uid) + " Won!!!");
		}

		let nextPlayer = game.x === props.location.state.uid ? game.o : game.x;

		firebase
			.firestore()
			.collection("games")
			.doc(gameId)
			.update({ board: game.board, turn: nextPlayer });
	};

	const checkWinner = () => {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (
				game.board[a] &&
				game.board[a] === game.board[b] &&
				game.board[a] === game.board[c]
			) {
				return game.board[a];
			}
		}
		return null;
	};

	const getPlayerString = (uid) => {
		return uid === game.x ? "X" : "O";
	};

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
