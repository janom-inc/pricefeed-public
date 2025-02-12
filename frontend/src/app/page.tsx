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
	}, []);
	return (
		<div>
			<img alt="eyecatch" src="/img/eyecatch.png" style={{ width: '100%' }} />
		</div>
	);
}
