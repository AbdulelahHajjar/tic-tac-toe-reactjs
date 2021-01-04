import React from "react";
import Header from "../Components/Header";
import GameActions from "../Components/GameActions";

function Home() {
	return (
		<div style={containerStyle}>
			<Header
				title="TicTacToe"
				subtitle="The simple TicTacToe game you have been looking for..."
			/>
			<GameActions />
		</div>
	);
}

const containerStyle = {
	display: "flex",
	textAlign: "center",
	flexDirection: "column",
};

export default Home;
