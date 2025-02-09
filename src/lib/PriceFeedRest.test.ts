
import typia from 'typia';

import {
	RestResponsePing,
	RestResponseRate,
	RestResponseRates,
	RestResponsePrice,
} from '../types';
import { PriceFeedRest } from './PriceFeedRest';

describe('PriceFeedRest', () => {
	const rest = new PriceFeedRest();
	test('ping', async () => {
		const res = await rest.ping();
		typia.assertEquals<RestResponsePing>(res);
	});
	test('rate', async () => {
		const res = await rest.rate('binance', { base: 'BTC', quote: 'USDT' });
		typia.assertEquals<RestResponseRate>(res);
	});
	test('rates', async () => {
		const res = await rest.rates();
		typia.assertEquals<RestResponseRates>(res);
	});
	test('price', async () => {
		const res = await rest.price({ base: 'BTC', quote: 'USDT' });
		typia.assertEquals<RestResponsePrice>(res);
	});
});
