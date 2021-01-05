// eslint-disable-next-line no-unused-vars
class GameObject {
	constructor(id, code, x, o, currentPlayer, board) {
		this.id = id;
		this.code = code;
		this.x = x;
		this.o = o;
		this.currentPlayer = currentPlayer;
		this.board = board;
	}

	currentPlayerId() {
		return this.currentPlayer === "x" ? this.x : this.o;
	}

	canMakeMove(uid, index) {
		return (
			!this.existsWinner() &&
			this.board[index] == null &&
			uid === this.currentPlayerId()
		);
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

export const gameConverter = {
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

export function createGameObject() {
	return new GameObject(
		null,
		generateGameCode(),
		null,
		null,
		"x",
		Array(9).fill(null)
	);
}

function generateGameCode() {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < 6; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}
