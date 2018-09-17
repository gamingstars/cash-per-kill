import {Signal} from "./Event";
import {Client} from "browser-http-client";

export class AppSignals {
	onStatusReceived: Signal = new Signal();
}

export var Signals = new AppSignals();

export class AppState {

}

export class HttpAPI {
	requestStatus() {
		console.log("Requesting getStatus");
		return new Promise<any>(function (resolve, reject) {
			Client.get("/api/getStatus").then(function (result) {
				if (result.is_ok()) {
					resolve(result.unwrap());
				}
				else {
					reject(result.unwrap_err());
				}
			});
		})
	}
}

export var State = new AppState();
export var API = new HttpAPI();

