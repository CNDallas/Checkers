import React, {Component} from 'react'
import './css/OpenGameCard.css'
import 'tachyons'


class OpenGameCard extends Component {
	render() {
		return (
			<div className="center">
				<div className="profile">
					<div className="image">
						<div className="circle-1 grow"></div>
						<div className="circle-2 grow">
							<img id="image" src={require('./img/tiger.png')} width="70" height="70"
							     alt="A TIGER?"/></div>
					</div>

					<div className="userName" id="userName">Tony</div>
					<div className="rank" id="rank">The Greatest</div>
					<div className="actions">
						<button className="btn" id='join'>Join Game</button>
						<button className="btn" id='message'>Send Message</button>
					</div>
				</div>

				<div className="stats">
					<div className="box">
						<span id='wins'>523</span>
						<span id="strWins">Wins</span>
					</div>
					<div className="box">
						<span id='loses'>1387</span>
						<span id="strLoses">Loses</span>
					</div>
					<div className="box">
						<span id="kings">146</span>
						<span id="strKing">King Me!</span>
					</div>
				</div>
			</div>
		)
	}
}

export default OpenGameCard
