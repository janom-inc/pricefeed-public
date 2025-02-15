
import { DEFAULT_REST_ENDPOINT } from '..';
import {
	Pair,
	ResponsePing,
	ResponseRate,
	ResponseRates,
	ResponseRoute,
	ResponsePrice,
} from '../types';

export class PriceFeedRest {
	
	constructor(
		public readonly endpoint: string = process.env.PRICEFEED_REST_ENDPOINT ?? DEFAULT_REST_ENDPOINT,
	) {
	}
	
	public async fetch<T>(path: string): Promise<T> {
		return (await (await fetch(`${this.endpoint}${path}`)).json()) as T;
	}
	
	public ping(): Promise<ResponsePing> {
		return this.fetch<ResponsePing>('/v1/ping');
	}
	
	public rate(source: string, pair: Pair): Promise<ResponseRate> {
		return this.fetch<ResponseRate>(`/v1/rate/${source}/${pair.base}-${pair.quote}`);
	}
	
	public rates(): Promise<ResponseRates> {
		return this.fetch<ResponseRates>('/v1/rates');
	}
	
	public route(pair: Pair): Promise<ResponseRoute> {
		return this.fetch<ResponseRoute>(`/v1/route/${pair.base}-${pair.quote}`);
	}
	
	public price(pair: Pair): Promise<ResponsePrice> {
		return this.fetch<ResponsePrice>(`/v1/price/${pair.base}-${pair.quote}`);
	}
	
}
