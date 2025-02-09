
import { PriceFeed } from '../index';

const main = async () => {
	const sdk = new PriceFeed();
	sdk.ws.addEventListener('open', async () => {
		console.log(await sdk.ws.ping());
		sdk.close();
	});
};

main();
