
import typia from 'typia';

import {
	DEFAULT_REST_ENDPOINT,
	DEFAULT_WS_ENDPOINT,
} from '..';

import {
	Pair,
	PathElement,
	ResponseRate,
	ResponseRates,
	ResponseRoute,
	ResponsePrice,
} from '../types';

import { PriceFeed } from './PriceFeed';

describe('PriceFeed', () => {
	test('construct without PRICEFEED_*_ENDPOINT', () => {
		delete process.env.PRICEFEED_REST_ENDPOINT;
		delete process.env.PRICEFEED_WS_ENDPOINT;
		expect(new PriceFeed()).toBeInstanceOf(PriceFeed);
	});
	test('construct with PRICEFEED_*_ENDPOINT', () => {
		process.env.PRICEFEED_REST_ENDPOINT = DEFAULT_REST_ENDPOINT;
		process.env.PRICEFEED_WS_ENDPOINT = DEFAULT_WS_ENDPOINT;
		expect(new PriceFeed()).toBeInstanceOf(PriceFeed);
	});
	test('construct with endpoint', () => {
		expect(new PriceFeed(
			DEFAULT_REST_ENDPOINT,
			DEFAULT_WS_ENDPOINT,
		)).toBeInstanceOf(PriceFeed);
	});
	test('fetchRate (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeed();
		const res = await sdk.fetchRate(new PathElement('binance', new Pair('BTC', 'USDT')));
		typia.assertEquals<ResponseRate>(res);
		sdk.close();
	});
	test('watchRates (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeed();
		const res = await sdk.watchRates(new Set([new PathElement('binance', new Pair('BTC', 'USDT'))]));
		typia.assertEquals<ResponseRates>(res);
		sdk.close();
	});
	test('fetchRoute (BTC-USDT)', async () => {
		const sdk = new PriceFeed();
		const res = await sdk.fetchRoute(new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponseRoute>(res);
		sdk.close();
	});
	test('fetchPrice (BTC-USDT)', async () => {
		const sdk = new PriceFeed();
		const res = await sdk.fetchPrice(new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponsePrice>(res);
		sdk.close();
	});
	test('watchPrice (BTC-USDT)', async () => {
		const sdk = new PriceFeed();
		const res = await sdk.watchPrice(new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponsePrice>(res);
		sdk.close();
	});
});
