
import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	WebSocketResponse,
	WebSocketResponsePing,
	WebSocketResponseSnapshot,
	WebSocketResponseUpdate,
} from '../types';

// Workaround for CloseEvent not being defined in globalThis (e.g. in Node.js).
export class CloseEventFallback extends Event {
	public readonly code: number;
	public readonly reason: string;
	public readonly wasClean: boolean;
	constructor(type: string, eventInitDict: any = {}) {
		super(type, eventInitDict);
		this.code = eventInitDict.code;
		this.reason = eventInitDict.reason;
		this.wasClean = eventInitDict.wasClean;
	}
}
if(!globalThis.CloseEvent) {
	globalThis.CloseEvent = CloseEventFallback;
}

// Copied from https://zenn.dev/reosablo/articles/2c3624697ebe8d
declare class TypedEventTarget<EventMap extends Record<string, Event>> extends EventTarget {
	addEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, evt: EventMap[Type]) => void,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		...args: Parameters<EventTarget["addEventListener"]>
	): void;
	removeEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, evt: EventMap[Type]) => void,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		...args: Parameters<EventTarget["removeEventListener"]>
	): void;
}

export class PriceFeedWebSocket extends (EventTarget as typeof TypedEventTarget<{
	open: Event;
	close: CloseEvent;
	error: Event;
	message: MessageEvent<WebSocketResponse<string, unknown>>;
	'message-snapshot': MessageEvent<WebSocketResponseSnapshot>;
	'message-update': MessageEvent<WebSocketResponseUpdate>;
}>) {
	
	private _id = 0;
	private _ws = new ReconnectingWebSocket(this.endpoint);
	
	constructor(
		public readonly endpoint: string = 'wss://api.pricefeed.info',
	) {
		super();
		this._ws.addEventListener('open', (event) => {
			this.dispatchEvent(new Event('open'));
		});
		this._ws.addEventListener('close', () => {
			this.dispatchEvent(new CloseEvent('close'));
		});
		this._ws.addEventListener('error', (event) => {
			this.dispatchEvent(new Event('error'));
		});
		this._ws.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			this.dispatchEvent(new MessageEvent('message', {
				bubbles: event.bubbles,
				cancelable: event.cancelable,
				composed: event.composed,
				data,
				origin: event.origin,
				lastEventId: event.lastEventId,
				source: event.source,
				ports: [...event.ports],
			}));
			this.dispatchEvent(new MessageEvent(`message-${data.data.type}`, {
				bubbles: event.bubbles,
				cancelable: event.cancelable,
				composed: event.composed,
				data,
				origin: event.origin,
				lastEventId: event.lastEventId,
				source: event.source,
				ports: [...event.ports],
			}));
		});
	}
	
	public close() {
		this._ws.close();
	}
	
	public async send(data: any) {
		if(data.id === undefined) {
			data.id = this._id++;
		}
		return await new Promise<any>((resolve) => {
			const listner = (event: MessageEvent) => {
				const message = event.data;
				if(message.id === data.id) {
					this.removeEventListener('message', listner);
					resolve(message);
				}
			};
			this.addEventListener('message', listner);
			this._ws.send(JSON.stringify(data));
		});
	}
	
	public ping(): Promise<WebSocketResponsePing> {
		return this.send({ method: 'ping' });
	}
	
	public subscribe(sourceStrs: string[]): Promise<WebSocketResponseSnapshot> {
		return this.send({ method: 'subscribe', data: sourceStrs });
	}
	
}
