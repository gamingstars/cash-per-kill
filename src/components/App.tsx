import * as React from "react";
import "./../assets/scss/App.scss";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebookF, faInstagram, faSkype, faTwitch, faYoutube} from '@fortawesome/free-brands-svg-icons'
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {API, Signals} from "../AppState";
import {SignalConnection} from "../Event";
import {Link, Route, Switch, withRouter} from "react-router-dom";

const reactLogo = require("./../assets/img/react_logo.svg");
const design = require("./../assets/img/design.jpg");
const logo = require("./../assets/img/logo.png");

export interface AppProps {
}


function gameModeToString(gameMode: string) {
	if (gameMode == "1vs1") {
		return "1 vs 1";
	}
	if (gameMode == "team") {
		return "Team vs Team";
	}
	if (gameMode == "free") {
		return "Free for All";
	}
}

class Search extends React.Component<any, any> {
	render() {
		return (
			<div className={"search"}>
				<input placeholder={"Search..."}/>
				<div className={"icon"}>
					<FontAwesomeIcon icon={faSearch}/>
				</div>
			</div>
		);
	}
}


class SocialIcon extends React.Component<any, any> {
	render() {
		return (<div className={"social-icon"}>
			<FontAwesomeIcon icon={this.props.icon}/>
		</div>)
	}
}

class Social extends React.Component<any, any> {
	render() {
		return (
			<div className={"social"}>
				<SocialIcon icon={faFacebookF}/>
				<SocialIcon icon={faYoutube}/>
				<SocialIcon icon={faInstagram}/>
				<SocialIcon icon={faSkype}/>
				<SocialIcon icon={faTwitch}/>
			</div>
		)
	}
}


class HeaderButton extends React.Component<any, any> {
	render() {
		var classname = "header-button";
		if (this.props.className) {
			classname += " " + this.props.className;
		}
		return (
			<button className={classname}>
				{this.props.name}
			</button>
		);
	}
}

class Section extends React.Component<any, any> {
	render() {
		var classname = "inner-section";
		if (this.props.className) {
			classname += " " + this.props.className;
		}
		return (
			<div className={classname}>
				{this.props.children}
			</div>
		)
	}
}

class PlayerInfo extends React.Component<any, any> {
	render() {
		return (
			<div className={"player-info"}>
				Welcome <span className={"name"}>{this.props.name}</span><br/>
				your balance is <span className={"balance"}>{this.props.balance}</span>
			</div>
		);
	}
}

class Header extends React.Component<any, any> {
	render() {
		return (
			<div className="header">
				<Section>
					<Search/>
					<Social/>
					<div className={"buttons"}>
						<HeaderButton name="Contact Us"/>
						{!this.props.name &&
            <a href="/login" className={"header-button login"}>Login through Steam</a>}
						{this.props.name && <PlayerInfo {...this.props}/>}
					</div>
				</Section>
			</div>
		)
	}
}


class Logo extends React.Component<any, any> {
	render() {
		return (
			<img className="logo" src={logo}/>
		);
	}
}

class MenuItem extends React.Component<any, any> {
	render() {
		var classname = "menu-item";
		console.log(this.props);
		const path = this.props.location.pathname;
		if (this.props.to == "/" && path == "/") {
			classname += " selected";
		}
		else if (this.props.to != "/" && path.startsWith(this.props.to)) {
			classname += " selected";
		}
		if (this.props.selected) {
			classname += " selected";
		}

		return (
			<Link className={classname} to={this.props.to}>{this.props.name}</Link>
		);
	}
}

const MenuItemWithRouter = withRouter(MenuItem);

class MenuBar extends React.Component<any, any> {
	render() {
		return (
			<div className="menu-bar">
				<Section>
					<Logo/>
					<MenuItemWithRouter name="HOME" to={"/"}/>
					<MenuItemWithRouter name="PLAY NOW" to={"/play"}/>
					<MenuItemWithRouter name="DEPOSIT" to={"/deposit"}/>
					<MenuItemWithRouter name="WITHDRAW" to={"/withdraw"}/>
					<MenuItemWithRouter name="ABOUT US" to={"/about"}/>
					<MenuItemWithRouter name="FAQ" to={"/faq"}/>
				</Section>
			</div>
		)
	}
}

const StackSize = withRouter(
	class StackSize extends React.Component<any, any> {
		render() {
			let className = "";
			if (this.props.value == this.props.stack) {
				className = "selected";
			}
			return (
				<div className={"stake"}>
					<div className={"choose-info"}>
						<div className={"size"}>{this.props.value}</div>
						<div className={"text"}>Game Coin<br/> per kill</div>
					</div>
					<Link className={className} to={`/play/${this.props.mode}/${this.props.value}`}>CHOOSE</Link>
				</div>
			)
		}
	}
);

const ChooseServer = withRouter(
	class ChooseServer extends React.Component<any, any> {
		render() {
			console.log(this.props);
			return (
				<div className={"server-choose"}>
					<Section>
						<div className={"info"}>
							List of servers to play with selected options<br/>
							({gameModeToString(this.props.mode)} / {this.props.stack} Game Coin per kill)
						</div>
						<div className={"red"}/>
						<ServerList servers={this.props.servers}/>
					</Section>
				</div>
			)
		}
	}
);


class ChooseStackSize extends React.Component<any, any> {
	render() {
		console.log(this.props);
		return (
			<div>
				<div className={"stack-choose"}>
					<Section>
						<div className={"info"}>Chose one stake<br/> size option</div>
						<div className={"red"}/>
						<div className={"stakes"}>
							<StackSize value={0.1} {...this.props.match.params}/>
							<StackSize value={0.2} {...this.props.match.params}/>
							<StackSize value={0.3} {...this.props.match.params}/>
							<StackSize value={0.4} {...this.props.match.params}/>
							<StackSize value={0.5} {...this.props.match.params}/>
							<StackSize value={1} {...this.props.match.params}/>
						</div>
					</Section>
				</div>
				{this.props.match.params.stack &&
        <ChooseServer {...this.props.match.params} servers={this.props.servers}/>}
			</div>
		)
	}
}

interface ServerItemModel {
	location: string;
	map: string;
	address: string;
	playersMax: number;
	players: number;
}

const germanyFlag = require("./../assets/img/germany.png");

class ServerItem extends React.Component<ServerItemModel, any> {
	render() {
		return (
			<tr>
				<td><img src={germanyFlag} className={"flag"}/>{this.props.location}</td>
				<td>{this.props.map}</td>
				<td>{this.props.address}</td>
				<td>{this.props.players} / {this.props.playersMax}</td>
				<td><a href={`steam://connect/${this.props.address}`}>PLAY NOW</a></td>
			</tr>
		)
	}
}


class ServerList extends React.Component<any, any> {
	render() {
		const serverList = this.props.servers || [];
		const servers = serverList.map(function (value, index) {
			return (<ServerItem {...value}/>)
		});
		return (
			<table className={"server-list"}>
				{servers}
			</table>
		)
	}
}


class GameType extends React.Component<any, any> {
	render() {
		var classname = "type";
		if (this.props.selected) {
			classname += " selected"
		}
		return (
			<div className={classname} onClick={this.props.onClick}>
				<Link to={"/play/" + this.props.to}>
					<div className={"tint"}/>
					<div className={"text"}>{this.props.name}</div>
				</Link>
			</div>
		);
	}
}

class GameTypes extends React.Component<any, any> {

	render() {
		return (

			<div className={"types"}>
				<GameType name={"1 vs 1"} to={"1vs1"}/>
				<GameType name={"Team vs Team"} to={"team"}/>
				<GameType name={"Free for All"} to={"free"}/>
			</div>
		);
	}
}


class ChooseType extends React.Component<any, any> {
	render() {
		return (
			<div className={"game-type"}>
				<Section>
					<div className={"message"}>
						<div>Taking experience to a</div>
						<div>whole new level in CS:GO</div>
					</div>

					<GameTypes/>
				</Section>
			</div>
		);
	}
}

class Contents extends React.Component<any, any> {
	render() {
		var self = this;
		return (
			<div className="contents">
				<Header {...this.props.player}/>
				<MenuBar/>
				<Switch>
					<Route exact path={"/play"} component={ChooseType}/>
					<Route exact path={"/play/:mode"} render={({match}) => (
						<ChooseStackSize servers={this.props.servers} match={match}/>
					)}/>
					<Route path={"/play/:mode/:stack"} render={({match}) => (
						<ChooseStackSize servers={this.props.servers} match={match}/>
					)}/>
				</Switch>
			</div>
		)
	}
}

export default class App extends React.Component<AppProps, undefined> {
	update: SignalConnection;

	componentDidMount(): void {
		var self = this;
		API.requestStatus().then(function (data) {
			console.log("Result received", data.data);
			self.setState(data.data);
		});

		this.update = Signals.onStatusReceived.on(function (data) {
			self.setState(data);
		});
	}

	componentWillUnmount(): void {
		this.update.off();
	}

	render() {
		return (
			<div className="app">
				<div className="design-container">
					<img src={design} className="design"/>
				</div>
				<Contents {...this.state}/>
			</div>
		);
	}
}
