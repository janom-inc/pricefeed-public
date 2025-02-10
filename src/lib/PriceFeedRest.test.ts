
import typia from 'typia';

import {
	Pair,
	ResponsePing,
	ResponseRate,
	ResponseRates,
	ResponseRoute,
	ResponsePrice,
} from '../types';
import { PriceFeedRest } from './PriceFeedRest';

describe('PriceFeedRest', () => {
	const rest = new PriceFeedRest();
	test('ping', async () => {
		const res = await rest.ping();
		typia.assertEquals<ResponsePing>(res);
	});
	test('rate', async () => {
		const res = await rest.rate('binance', new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponseRate>(res);
	});
	test('rates', async () => {
		const res = await rest.rates();
		typia.assertEquals<ResponseRates>(res);
	});
	test('route', async () => {
		const res = await rest.route(new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponseRoute>(res);
	});
	test('price', async () => {
		const res = await rest.price(new Pair('BTC', 'USDT'));
		typia.assertEquals<ResponsePrice>(res);
	});
});
