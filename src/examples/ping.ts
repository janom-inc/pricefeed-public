
import { PriceFeed } from '../index';

const main = async () => {
	const sdk = new PriceFeed();
	sdk.addEventListener('open', async () => {
		console.log(await sdk.ping());
		sdk.close();
	});
};

main();
