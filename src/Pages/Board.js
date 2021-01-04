import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";

var listener = null;

function Board() {
	const [board, setBoard] = useState(null);

	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}

	const query = useQuery();
	const code = query.get("code");

	useEffect(() => {
		if (listener) return;
		listener = firebase
			.firestore()
			.collection("boards")
			.where("code", "==", code)
			.onSnapshot((documentSnapshot) => {
				setBoard(documentSnapshot.docs[0].data());
			});
	}, [code]);

	if (board != null && board.x != null && board.o != null) {
		return (
			<div>
				{board.squares.map((square) => {
					return <Square player={square} />;
				})}
			</div>
		);
	} else {
		return (
			<div style={containerStyle}>
				<Header
					title="Waiting for contenstant to join..."
					subtitle={`Board code is ${code}`}
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

export default Board;
