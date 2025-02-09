
import typia from 'typia';

import { PriceFeedWebSocket } from './PriceFeedWebSocket';
import {
	WebSocketResponsePing,
	WebSocketResponseSnapshot,
	WebSocketResponseUpdate,
} from '../types';

describe('PriceFeedWebSocket', () => {
	test('should exit normally', () => {
		const sdk = new PriceFeedWebSocket();
		sdk.close();
	});
	test('ping', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.ping();
		try {
			typia.assertEquals<WebSocketResponsePing>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribe (empty)', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.subscribe([]);
		try {
			typia.assertEquals<WebSocketResponseSnapshot>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('subscribe (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		const res = await sdk.subscribe(['binance:BTC-USDT']);
		try {
			typia.assertEquals<WebSocketResponseSnapshot>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
	test('receive update (binance:BTC-USDT)', async () => {
		const sdk = new PriceFeedWebSocket();
		await sdk.subscribe(['binance:BTC-USDT']);
		const res = await new Promise<WebSocketResponseUpdate>((resolve) => {
			sdk.addEventListener('message-update', (event) => {
				resolve(event.data);
			});
		});
		try {
			typia.assertEquals<WebSocketResponseUpdate>(res);
		} catch (e) {
			sdk.close();
			throw e;
		}
		sdk.close();
	});
});
