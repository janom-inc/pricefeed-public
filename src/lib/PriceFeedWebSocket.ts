
import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	WebSocketResponse,
	WebSocketResponsePing,
	WebSocketResponseSnapshot,
	WebSocketResponseUpdate,
	WebSocketRequest,
	WebSocketRequestPing,
	WebSocketRequestSubscribeRates,
	WebSocketRequestSubscribePrice,
	CloseEventFallback,
	TypedEventTarget,
} from '../types';

if(!globalThis.CloseEvent) {
	globalThis.CloseEvent = CloseEventFallback;
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
	
	public async send<T extends string, U>(data: WebSocketRequest<T, U>) {
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
		const req: Omit<WebSocketRequestPing, 'id'> = { method: 'ping' };
		return this.send(req);
	}
	
	public subscribeRates(pathElemStrs: string[]): Promise<WebSocketResponseSnapshot> {
		const req: Omit<WebSocketRequestSubscribeRates, 'id'> = {
			method: 'subscribe',
			data: {
				type: 'rate',
				payload: pathElemStrs,
			},
		};
		return this.send(req);
	}
	
	public subscribePrice(pairStr: string): Promise<WebSocketResponseSnapshot> {
		const req: Omit<WebSocketRequestSubscribePrice, 'id'> = {
			method: 'subscribe',
			data: {
				type: 'price',
				payload: pairStr,
			},
		};
		return this.send(req);
	}
	
}
