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
					setGame(gameObj);
				} else {
					//TODO: Display error (implement catch method if possible)
				}
			});
	};

	const makePlay = (index) => {
		// TODO: Implement better id technique
		if (game.currentPlayerId() !== props.location.state.uid) return;
		// TODO: Implement not making a move when square is filled
		// TODO: Implement not making a move when there is a winner
		// TODO: check if player string is null
		game.makeMove(index);

		if (game.existsWinner()) {
			console.log(game.currentPlayer + " Won!!!");
			// TODO: Display prompt
		}
		console.log(game.board, "***", game.nextPlayer());
		firebase
			.firestore()
			.collection("games")
			.doc(game.id)
			.update({ board: game.board, currentPlayer: game.nextPlayer() });
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

class GameObject {
	constructor(id, code, x, o, currentPlayer, board) {
		this.id = id;
		this.code = code;
		this.x = x;
		this.o = o;
		this.currentPlayer = currentPlayer;
		this.board = board;
	}

	getPlayerString(uid) {
		return uid === this.x ? "x" : "o";
	}

	currentPlayerId() {
		return this.currentPlayer === "x" ? this.x : this.o;
	}

	makeMove(index) {
		this.board[index] = this.currentPlayer;
	}

	nextPlayer() {
		return this.currentPlayer === "x" ? "o" : "x";
	}

	existsWinner() {
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
				this.board[a] &&
				this.board[a] === this.board[b] &&
				this.board[a] === this.board[c]
			) {
				return this.board[a];
			}
		}
		return null;
	}
}

const gameConverter = {
	toFirestore: function (game) {
		return {
			code: game.code,
			x: game.x,
			o: game.o,
			currentPlayer: game.currentPlayer,
			board: game.board,
		};
	},
	fromFirestore: function (snapshot, options) {
		const data = snapshot.data(options);
		return new GameObject(
			data.id,
			data.code,
			data.x,
			data.y,
			data.currentPlayer,
			data.board
		);
	},
};
