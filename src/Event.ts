export class SignalConnection {
	public key: string;
	public signal: Signal;

	public constructor(signal, key) {
		this.signal = signal;
		this.key = key;
	}

	public off() {
		this.signal.off(this.key);
	}
}

export class MultiSignal {
	signals: Signal[] = [];
	connections: SignalConnection[] = [];

	public constructor(signals: Signal[]) {
		this.signals = signals;
	}

	public on(callback: Function) {
		for (var i = 0; i < this.signals.length; i++) {
			var signal = this.signals[i];
			var token = signal.on(callback);
			this.connections.push(token);
		}
	}

	public off() {
		while (this.connections.length > 0) {
			var token = this.connections.pop();
			token.off();
		}
	}
}


export class Signal {
	public subscribers: any = {};
	public subcount = 0;

	public on(callback: Function): SignalConnection {
		var key = "s" + this.subcount;
		this.subscribers[key] = callback;
		this.subcount++;
		return new SignalConnection(this, key);
	}

	public off(handle) {
		if (this.subscribers[handle]) {
			delete this.subscribers[handle];
		}
	}

	public clear() {
		var keys = [];
		for (var key in this.subscribers) {
			keys.push(key);
		}

		for (var i = 0; i < keys.length; i++) {
			this.off(keys[i]);
		}
	}

	public dispatch(data?: any) {
		for (var key in this.subscribers) {
			var curSubscriber = this.subscribers[key];
			curSubscriber(data);
		}
	}
}

class PubSubImpl {
	public events: any = {};

	public subscribe(event, callback): SignalConnection {
		var signal: Signal = this.events[event];
		if (!signal) {
			signal = new Signal();
			this.events[event] = signal;
		}
		return signal.on(callback);
	}

	public dispatch(event: string, args?: any) {
		var signal: Signal = this.events[event];
		if (signal) {
			signal.dispatch(args);
		}
	}
}

export var PubSub: PubSubImpl = new PubSubImpl();

setInterval(function () {
	PubSub.dispatch("onTick");
}, 1000);

setInterval(function () {
	PubSub.dispatch("onTick3");
}, 3000);
