
import typia from 'typia';

import { PriceFeedWebSocket } from './PriceFeedWebSocket';
import { DEFAULT_WS_ENDPOINT } from '..';
import {
	ResponsePing,
	ResponseRates,
	ResponsePrice,
} from '../types';

describe('PriceFeedWebSocket', () => {
	test('construct without PRICEFEED_WS_ENDPOINT', () => {
		delete process.env.PRICEFEED_WS_ENDPOINT;
		const sdk = new PriceFeedWebSocket();
		expect(sdk).toBeInstanceOf(PriceFeedWebSocket);
		sdk.close();
	});
	test('construct with PRICEFEED_WS_ENDPOINT', () => {
		process.env.PRICEFEED_WS_ENDPOINT = DEFAULT_WS_ENDPOINT;
		const sdk = new PriceFeedWebSocket();
		expect(sdk).toBeInstanceOf(PriceFeedWebSocket);
		sdk.close();
	});
	test('construct with endpoint', () => {
		const sdk = new PriceFeedWebSocket(DEFAULT_WS_ENDPOINT);
		expect(sdk).toBeInstanceOf(PriceFeedWebSocket);
		sdk.close();
	});
	test('ping', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.ping();
		try {
			typia.assertEquals<ResponsePing>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribeRates (empty)', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.subscribeRates([]);
		try {
			typia.assertEquals<ResponseRates>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribeRates (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.subscribeRates(['binance:BTC-USDT']);
		try {
			typia.assertEquals<ResponseRates>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribeRates: receive update (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		await sdk.subscribeRates(['binance:BTC-USDT']);
		const res = await new Promise<ResponseRates>((resolve) => {
			sdk.addEventListener('message-rates', (event) => {
				if(event.data.id === undefined) {
					resolve(event.data);
				}
			});
		});
		try {
			typia.assertEquals<ResponseRates>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribePrice (BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.subscribePrice('BTC-USDT');
		try {
			typia.assertEquals<ResponsePrice>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribePrice: receive update (BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		await sdk.subscribePrice('BTC-USDT');
		const res = await new Promise<ResponsePrice>((resolve) => {
			sdk.addEventListener('message-price', (event) => {
				if(event.data.id === undefined) {
					resolve(event.data);
				}
			});
		});
		try {
			typia.assertEquals<ResponsePrice>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
});
