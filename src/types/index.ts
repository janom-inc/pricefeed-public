
export * from './rest';

export interface Pair {
	base: string;
	quote: string;
}

export interface TradingVolume {
	base: number;
	quote: number;
}

export interface ExchangeRate {
	time: number;
	pair: Pair;
	rate: number;
	tradingVolume24h?: TradingVolume;
	source?: string;
}

export interface ExchangeRateWithSource extends ExchangeRate {
	source: string;
}
