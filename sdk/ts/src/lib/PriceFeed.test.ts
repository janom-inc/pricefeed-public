
import { PriceFeed } from './PriceFeed';

describe('PriceFeed', () => {
	test('should exit normally', async () => {
		const sdk = new PriceFeed();
		await sdk.close();
	});
});
