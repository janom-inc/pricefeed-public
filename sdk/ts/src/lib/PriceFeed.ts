
import {
	DEFAULT_REST_ENDPOINT,
	DEFAULT_WS_ENDPOINT,
} from '..';
import {
	PriceFeedRest,
	PriceFeedWebSocket,
} from '.';
import {
	Pair,
	PathElement,
	ResponseRate,
	ResponseRates,
	ResponseRoute,
	ResponsePrice,
	TypedEventTarget,
} from '../types';

export class PriceFeed extends (EventTarget as typeof TypedEventTarget<{
	rates: MessageEvent<ResponseRates>;
	price: MessageEvent<ResponsePrice>;
}>) {
	
	public readonly rest = new PriceFeedRest(this.restEndpoint);
	public readonly ws = new PriceFeedWebSocket(this.wsEndpoint);
	
	constructor(
		public readonly restEndpoint: string = process.env.PRICEFEED_REST_ENDPOINT ?? DEFAULT_REST_ENDPOINT,
		public readonly wsEndpoint: string = process.env.PRICEFEED_WS_ENDPOINT ?? DEFAULT_WS_ENDPOINT,
	) {
		super();
		this.ws.addEventListener('message-rates', (event) => {
			const rates = event.data;
			this.dispatchEvent(new MessageEvent('rates', { data: rates }));
		});
		this.ws.addEventListener('message-price', (event) => {
			const price = event.data;
			this.dispatchEvent(new MessageEvent('price', { data: price }));
		});
	}
	
	public close() {
		this.ws.close();
	}
	
	public async fetchRate(elem: PathElement): Promise<ResponseRate> {
		return await this.rest.rate(elem.source, elem.pair);
	}
	
	public async watchRates(elems: Set<PathElement>): Promise<ResponseRates> {
		return await this.ws.subscribeRates([...elems.values()].map((sourceAndPair) => sourceAndPair.toString()));
	}
	
	public async fetchRoute(pair: Pair): Promise<ResponseRoute> {
		return await this.rest.route(pair);
	}
	
	public async fetchPrice(pair: Pair): Promise<ResponsePrice> {
		return await this.rest.price(pair);
	}
	
	public async watchPrice(pair: Pair): Promise<ResponsePrice> {
		return await this.ws.subscribePrice(pair.toString());
	}
	
}
