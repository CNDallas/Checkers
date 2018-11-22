import React, {Component} from "react";
import Controller from "./components/Controller";
import "./App.css";
import "./index.css";
import "./components/css/NavBar.css"

class App extends Component {
	render() {
		return (
			<div className="App">
				<Controller/>
			</div>
		);
	}
}

export default App;
