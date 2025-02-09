
import {
	PriceFeedRest,
	PriceFeedWebSocket,
} from '.';
import {
	Pair,
	PathElement,
	Path,
	Route,
	ExchangeRateWithSource,
	WebSocketResponseSnapshot,
	WebSocketResponseUpdate,
	TypedEventTarget,
} from '../types';

export class PriceFeed extends (EventTarget as typeof TypedEventTarget<{
	rate: MessageEvent<ExchangeRateWithSource>;
}>) {
	
	public readonly rest = new PriceFeedRest(this.restEndpoint);
	public readonly ws = new PriceFeedWebSocket(this.wsEndpoint);
	
	// sourceAndPairStr => ExchangeRate.
	private _rates: Map<string, ExchangeRateWithSource> = new Map();
	
	constructor(
		public readonly restEndpoint: string = 'https://api.pricefeed.info',
		public readonly wsEndpoint: string = 'wss://api.pricefeed.info',
	) {
		super();
		const subscriptionListener = (event: MessageEvent<WebSocketResponseSnapshot> | MessageEvent<WebSocketResponseUpdate>) => {
			const rates: ExchangeRateWithSource[] = event.data.data.payload;
			rates.forEach(rate => {
				this._setRate(rate);
			});
		};
		this.ws.addEventListener('message-snapshot', subscriptionListener);
		this.ws.addEventListener('message-update', subscriptionListener);
	}
	
	public close() {
		this.ws.close();
	}
	
	public getCachedRate(elem: PathElement): ExchangeRateWithSource | null {
		return this._rates.get(elem.toString()) ?? null;
	}
	
	private _setRate(rate: ExchangeRateWithSource) {
		this._rates.set(new PathElement(rate.source, rate.pair).toString(), rate);
		this.dispatchEvent(new MessageEvent('rate', { data: rate }));
	}
	
	public async fetchRate(elem: PathElement): Promise<ExchangeRateWithSource> {
		const rate = (await this.rest.rate(elem.source, elem.pair)).data.payload;
		this._setRate(rate);
		return rate;
	}
	
	public async watchRates(elems: Set<PathElement>): Promise<ExchangeRateWithSource[]> {
		const res = await this.ws.subscribe([...elems.values()].map((sourceAndPair) => sourceAndPair.toString()));
		return res.data.payload;
	}
	
	public async fetchRoute(pair: Pair): Promise<Route> {
		const pathStrs: string[] = (await this.rest.route(pair)).data.payload;
		const paths = pathStrs.map(pathStr => Path.fromString(pair, pathStr));
		return new Set(paths);
	}
	
}
