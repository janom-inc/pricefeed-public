
import ReconnectingWebSocket from 'reconnecting-websocket';

import {
	ExchangeRate,
	Pair,
} from '../types';
import {
	PriceFeedRest,
	PriceFeedWebSocket,
} from '.';

export class PriceFeed {
	
	public readonly rest = new PriceFeedRest(this.restEndpoint);
	public readonly ws = new PriceFeedWebSocket(this.wsEndpoint);
	
	constructor(
		public readonly restEndpoint: string = 'https://api.pricefeed.info',
		public readonly wsEndpoint: string = 'wss://api.pricefeed.info',
	) {
	}
	
	public close() {
		this.ws.close();
	}
	
}
