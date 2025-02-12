'use client';

import {
	useState,
	useEffect,
} from 'react';
import Image from 'next/image';

import {
	Grid2 as Grid,
	Typography,
} from '@mui/material';

import {
	Pair,
	ResponsePrice,
	PriceFeed,
} from '@pricefeed/sdk';

import PriceBoard from '@/components/PriceBoard';

export default function Home() {
	
	const [prices, setPrices] = useState<ResponsePrice[]>([]);
	
	useEffect(() => {
		const pricesToWatch = [
			'EUR-USD',
			'USD-JPY',
			'GBP-USD',
			'XAU-USD',
			'BTC-USD',
			'ETH-USD',
			'USDT-USD',
			'XRP-USD',
			'BNB-USD',
			'SOL-USD',
			'USDC-USD',
			'DOGE-USD',
			'ADA-USD',
			'TRX-USD',
			//'-',
		];
		const pf = new PriceFeed();
		(async () => {
			const prices = await Promise.all(pricesToWatch.map((pair) => {
				const [base, quote] = pair.split('-');
				return pf.watchPrice(new Pair(base, quote));
			}));
			setPrices(prices);
			pf.addEventListener('price', (event) => {
				const index = pricesToWatch.findIndex((pair) => pair === event.data.data.payload.pair);
				const newPrices = [...prices];
				newPrices[index] = event.data;
				setPrices(newPrices);
			});
		})();
	}, []);
	
	return (
		<div>
			<div
				style={{
					marginBottom: '3rem',
				}}
			>
				<Image
					alt="eyecatch"
					src="/img/eyecatch.png"
					width={0}
					height={0}
					sizes="100vw"
					style={{ width: '100%', height: 'auto' }}
				/>
			</div>
			<Typography variant="h3" gutterBottom>Live Prices</Typography>
			<Grid container spacing={2}>
				{prices.map((price) => {
					return (
						<Grid key={price.data.payload.pair} size={{ md: 2, sm: 3, xs: 6 }}>
							<PriceBoard pair={price.data.payload.pair} price={price.data.payload.price} />
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}
