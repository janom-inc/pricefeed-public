
import {
	PriceFeedRest,
	PriceFeedWebSocket,
} from '.';
import {
	Pair,
	PathElement,
	Path,
	Route,
	ExchangeRate,
	ResponseRates,
	ResponsePrice,
	TypedEventTarget,
} from '../types';

export class PriceFeed extends (EventTarget as typeof TypedEventTarget<{
	rate: MessageEvent<ExchangeRate>;
}>) {
	
	public readonly rest = new PriceFeedRest(this.restEndpoint);
	public readonly ws = new PriceFeedWebSocket(this.wsEndpoint);
	
	// sourceAndPairStr => ExchangeRate.
	private _rates: Map<string, ExchangeRate> = new Map();
	
	constructor(
		public readonly restEndpoint: string = process.env.PRICEFEED_REST_ENDPOINT ?? 'https://api.pricefeed.info',
		public readonly wsEndpoint: string = process.env.PRICEFEED_WS_ENDPOINT ?? 'wss://api.pricefeed.info',
	) {
		super();
		this.ws.addEventListener('message-rates', (event) => {
			const rates: ExchangeRate[] = event.data.data.payload;
			rates.forEach(rate => {
				this._setRate(rate);
			});
		});
	}
	
	public close() {
		this.ws.close();
	}
	
	public getCachedRate(elem: PathElement): ExchangeRate | null {
		return this._rates.get(elem.toString()) ?? null;
	}
	
	private _setRate(rate: ExchangeRate) {
		this._rates.set(new PathElement(rate.source, rate.pair).toString(), rate);
		this.dispatchEvent(new MessageEvent('rate', { data: rate }));
	}
	
	public async fetchRate(elem: PathElement): Promise<ExchangeRate> {
		const rate = (await this.rest.rate(elem.source, elem.pair)).data.payload;
		this._setRate(rate);
		return rate;
	}
	
	public async watchRates(elems: Set<PathElement>): Promise<ExchangeRate[]> {
		const res = await this.ws.subscribeRates([...elems.values()].map((sourceAndPair) => sourceAndPair.toString()));
		return res.data.payload;
	}
	
	public async fetchRoute(pair: Pair): Promise<Route> {
		const pathStrs: string[] = (await this.rest.route(pair)).data.payload;
		const paths = pathStrs.map(pathStr => Path.fromString(pair, pathStr));
		return new Set(paths);
	}
	
}
