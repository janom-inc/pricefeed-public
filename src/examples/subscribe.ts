
import { PriceFeed } from '../index';

const main = async () => {
	const sdk = new PriceFeed();
	sdk.addEventListener('open', async () => {
		console.log('Subscribing to all pairs...');
		await sdk.subscribe('all');
	});
	sdk.addEventListener('message', (event) => {
		console.log(event.data);
	});
};

main();
