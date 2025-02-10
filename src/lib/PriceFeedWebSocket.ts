
import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	Response,
	ResponsePing,
	ResponseRates,
	ResponsePrice,
	Request,
	RequestPing,
	RequestSubscribeRates,
	RequestSubscribePrice,
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
	message: MessageEvent<Response>;
	'message-rates': MessageEvent<ResponseRates>;
	'message-price': MessageEvent<ResponsePrice>;
}>) {
	
	private _id = 0;
	private _ws = new ReconnectingWebSocket(this.endpoint);
	
	constructor(
		public readonly endpoint: string = process.env.PRICEFEED_WS_ENDPOINT ?? 'wss://api.pricefeed.info',
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
			const messageEvent = {
				bubbles: event.bubbles,
				cancelable: event.cancelable,
				composed: event.composed,
				data,
				origin: event.origin,
				lastEventId: event.lastEventId,
				source: event.source,
				ports: [...event.ports],
			};
			this.dispatchEvent(new MessageEvent('message', messageEvent));
			this.dispatchEvent(new MessageEvent(`message-${data.data.type}`, messageEvent));
		});
	}
	
	public close() {
		this._ws.close();
	}
	
	public async send<M extends string, T extends string, P>(data: Request) {
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
	
	public ping(): Promise<ResponsePing> {
		const req: Omit<RequestPing, 'id'> = { method: 'ping' };
		return this.send(req);
	}
	
	public subscribeRates(pathElemStrs: string[]): Promise<ResponseRates> {
		const req: Omit<RequestSubscribeRates, 'id'> = {
			method: 'subscribe',
			data: {
				type: 'rates',
				payload: pathElemStrs,
			},
		};
		return this.send(req);
	}
	
	public subscribePrice(pairStr: string): Promise<ResponsePrice> {
		const req: Omit<RequestSubscribePrice, 'id'> = {
			method: 'subscribe',
			data: {
				type: 'price',
				payload: pairStr,
			},
		};
		return this.send(req);
	}
	
}
