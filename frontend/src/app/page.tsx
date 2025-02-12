'use client';

import {
	useState,
	useEffect,
} from 'react';
import { PriceFeed } from '@pricefeed/sdk';

export default function Home() {
	
	const [prices, setPrices] = useState<Record<string, number>>({});
	
	useEffect(() => {
		const pf = new PriceFeed();
		pf.addEventListener('price', (event) => {
			const pair = event.data.data.payload.pair;
			const price = event.data.data.payload.price;
			prices[]
			setPrices(event.detail);
		});
	}, []);
	
	return (
		<div>
			<img alt="eyecatch" src="/img/eyecatch.png" style={{ width: '100%' }} />
		</div>
	);
}
