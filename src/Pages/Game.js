import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Square from "../Components/Square";
import GameObject, { gameConverter } from "../Models/GameObject";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import Dialog from "../Components/Dialog";

import winnerIcon from "../images/winner-icon.svg";
import loserIcon from "../images/loser-icon.svg";
import informationIcon from "../images/information-icon.svg";

var gameListener = null;
const uid = uuidv4();

function Game() {
	const gamesRef = firebase.firestore().collection("games");
	const [game, setGame] = useState(null);
	const [prompt, setPrompt] = useState("Loading game...");
	const history = useHistory();
	// var uid = localStorage.getItem("uid");

	// if (uid == null) {
	// 	uid = uuidv4();
	// 	localStorage.setItem("uid", uid);
	// }

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};

	const code = useQuery().get("code");

	const attachGameListener = () => {
		// TODO: firestore sequrity rules
		if (gameListener) return;
		gameListener = gamesRef.where("code", "==", code);
		if (game == null) gameListener.where("winner", "==", null);

		gameListener.onSnapshot((querySnapshot) => {
			if (querySnapshot != null && querySnapshot.size > 0) {
				let doc = querySnapshot.docs[0];
				let gameObj = new GameObject(
					doc.id,
					doc.data().code,
					doc.data().x,
					doc.data().o,
					doc.data().currentPlayer,
					doc.data().winner,
					doc.data().board
				);
				setUpGame(gameObj);
			} else {
				setPrompt("Error: Cannot get game.");
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

	const setUpGame = (gameObj) => {
		if (gameObj.isContestant(uid)) {
			if (gameObj.x == null || gameObj.o == null) {
				setPrompt(`Game Code: ${gameObj.code}`);
			} else {
				setGame(gameObj);
				setPrompt(null);
			}
		} else if (gameObj.newContestantCanJoin()) {
			setPrompt("Joining game...");
			gameObj.addContestant(uid);
			gamesRef.doc(gameObj.id).withConverter(gameConverter).set(gameObj);
		} else {
			setPrompt("Error: Full game.");
		}
	};

	const makePlay = (index) => {
		if (!game.canMakeMove(uid, index)) return;
		game.makeMove(index);
		gamesRef.doc(game.id).withConverter(gameConverter).set(game);
	};

	const endGameDialog = () => {
		const isWinner = game.getPlayerID(game.winner) === uid;

		return (
			<Dialog
				icon={isWinner ? winnerIcon : loserIcon}
				title={
					isWinner
						? `Congratulations, ${game.winner.toUpperCase()}!`
						: `Hard luck, ${game.loser().toUpperCase()}`
				}
				subtitle={
					isWinner
						? "You won this match!"
						: "You lost this match, but you can always play again!"
				}
				buttonText={"Done"}
				buttonOnClick={() => {
					history.push(`/`);
				}}
			/>
		);
	};

	const promptDialog = () => {
		return <Dialog icon={informationIcon} title={prompt} />;
	};

	return (
		<div>
			{game && game.winner && endGameDialog()}
			{prompt && promptDialog()}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					backgroundColor: "#0d1019",
				}}
			>
				<div>
					<div
						style={{
							width: "600px",
							height: "600px",
							display: "grid",
							gridTemplateColumns: "auto auto auto",
							gridGap: "4px",
						}}
					>
						{game &&
							game.board.map((square, index) => {
								return (
									<Square
										key={index}
										index={index}
										player={
											square == null
												? null
												: square.toUpperCase()
										}
										makePlay={makePlay}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}

// const containerStyle = {
// 	display: "flex",
// 	textAlign: "center",
// 	flexDirection: "column",
// };

export default Game;
