import React from 'react'
import './css/OpenGameCard.css'
import 'tachyons'


const openGameCard = (props) => {

	return (
		<div className="center">
			<div className="profile">
				<div className="image">
					<div className="circle-1">
						<img id="image" src={require('./img/tiger.png')} alt="A TIGER?"/></div>
				</div>
			<div className="userInfo">
				<div className="userName" id="userName">{props.host}</div>
				<div className="rank" id="rank">{props.id}</div>
			</div>
				<div className="actions">
					<button onClick={props.joinGame} className="btn" id='join'>Join Game</button>
					<button className="btn" id='message'>Send Message</button>
				</div>
		</div>

			<div className="stats">
				<div className="box">
					<span className="boxInfo">
					<span id='wins'>523<br/></span>
						<span id="strWins">Wins</span></span>
				</div>
				<div className="box">
					<span className="boxInfo">
					<span id='loses'>1387<br/></span>
						<span id="strLoses">Loses</span></span>
				</div>
				<div className="box">
					<span className="boxInfo">
					<span id="kings">146<br/></span>
						<span id="strKing">King Me!</span></span>
				</div>
			</div>
		</div>

	);
};

export default openGameCard
