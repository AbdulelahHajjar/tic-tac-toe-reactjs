function Header(props) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1 style={titleStyle}>{props.title}</h1>
			<p style={subTitleStyle}>{props.subtitle}</p>
		</div>
	);
}

// const headerStyle = {
// 	display: "flex",
// 	flexDirection: "column",
// 	alignItems: "center",
// };

const titleStyle = {
	fontSize: "60pt",
};

const subTitleStyle = {
	fontSize: "20pt",
};

export default Header;
