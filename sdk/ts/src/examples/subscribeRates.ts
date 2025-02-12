
import { PriceFeed } from '../index';

const main = async () => {
	const sdk = new PriceFeed();
	sdk.ws.addEventListener('open', async () => {
		console.log('Subscribing to all pairs...');
		await sdk.ws.subscribeRates(['binance:BTC-USDT']);
	});
	sdk.ws.addEventListener('message', (event) => {
		console.dir(event.data, { depth: null });
	});
};

main();
