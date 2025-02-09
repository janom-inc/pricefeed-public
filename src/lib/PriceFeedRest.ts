
import {
	ExchangeRateWithSource,
	Pair,
	RestResponsePing,
	RestResponseRate,
	RestResponseRates,
	RestResponsePrice,
} from '../types';

export class PriceFeedRest {
	
	constructor(
		public readonly endpoint: string = 'https://api.pricefeed.info',
	) {
	}
	
	public async fetch<T>(path: string): Promise<T> {
		return (await (await fetch(`${this.endpoint}${path}`)).json()) as T;
	}
	
	public ping(): Promise<RestResponsePing> {
		return this.fetch<RestResponsePing>('/v1/ping');
	}
	
	public rate(source: string, pair: Pair): Promise<RestResponseRate> {
		return this.fetch<RestResponseRate>(`/v1/rate/${source}/${pair.base}-${pair.quote}`);
	}
	
	public rates(): Promise<RestResponseRates> {
		return this.fetch<RestResponseRates>('/v1/rates');
	}
	
	public price(pair: Pair): Promise<RestResponsePrice> {
		return this.fetch<RestResponsePrice>(`/v1/price/${pair.base}-${pair.quote}`);
	}
	
}
