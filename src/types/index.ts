
export * from './rest';
export * from './ws';

export type BaseOrQuote = 'base' | 'quote';

export interface Pair extends Record<BaseOrQuote, string> {
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
