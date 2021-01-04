function Square(props) {
	return (
		<button
			style={squareStyle}
			onClick={props.makePlay.bind(this, props.index)}
		>
			{props.player}
		</button>
	);
}

const squareStyle = {
	width: "200px",
	height: "200px",
};

export default Square;
