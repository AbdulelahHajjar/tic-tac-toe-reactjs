function Square(props) {
	return (
		<button
			style={squareStyle(props.player)}
			onClick={props.makePlay.bind(this, props.index)}
		>
			{props.player}
		</button>
	);
}

const squareStyle = (player) => {
	return {
		width: "200px",
		height: "200px",
		fontSize: "80pt",
		border: "none",
		borderRadius: "24px",
		cursor: "pointer",
		backgroundColor: "#1B2031",
		color: player === "X" ? "#6E62FF" : "#FF6262",
	};
};

export default Square;
