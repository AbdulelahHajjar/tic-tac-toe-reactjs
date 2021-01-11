function Dialog(props) {
	return (
		<div>
			<div style={shadowStyle}></div>
			<div style={divStyle}>
				<div>
					<img src={props.icon} alt="" />
					<h2>{props.title}</h2>
				</div>
				{props.subtitle && (
					<p style={dialogTextStyle}>{props.subtitle}</p>
				)}
				{props.buttonOnClick && props.buttonText && (
					<div>
						<button
							style={buttonStyle()}
							onClick={props.buttonOnClick}
						>
							{props.buttonText}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

const dialogTextStyle = {
	fontSize: "14pt",
	color: "#343a40",
};

const shadowStyle = {
	width: "100%",
	height: "100%",
	backgroundColor: "black",
	position: "fixed",
	opacity: "0.5",
};

const divStyle = {
	borderRadius: "20px",
	boxShadow: "0px 20px 25px 5px rgba(0,0,0,0.15)",
	width: "500px",
	height: "300px",
	display: "flex",
	backgroundColor: "white",
	flexDirection: "column",
	justifyContent: "space-around",
	textAlign: "center",
	alignContent: "center",
	position: "fixed",
	zIndex: "999",
	left: "50%",
	top: "50%",
	transform: `translate(${-50}%, ${-60}%)`,
	padding: "20px",
};

function buttonStyle(bgColor) {
	return {
		backgroundColor: bgColor || "#0436ff",
		border: "none",
		borderRadius: "10px",
		color: "white",
		width: "200px",
		height: "40px",
		fontWeight: "bold",
		cursor: "pointer",
	};
}

export default Dialog;
