
import { PriceFeed } from '../index';

const main = async () => {
	const sdk = new PriceFeed();
	sdk.ws.addEventListener('open', async () => {
		console.log('Subscribing to all pairs...');
		await sdk.ws.subscribe('all');
	});
	sdk.ws.addEventListener('message', (event) => {
		console.log(event.data);
	});
};

main();
