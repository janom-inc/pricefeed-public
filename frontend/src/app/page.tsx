'use client';

import {
	useState,
	useEffect,
} from 'react';
import Image from 'next/image';
import {
	Link,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import {
	CurrencyExchange as CurrencyExchangeIcon,
	AccountBalance as AccountBalanceIcon,
	CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import {
	CopyBlock,
	dracula,
} from 'react-code-blocks';

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
			<Typography variant="h3" gutterBottom>Features</Typography>
			<Grid container spacing={2}>
				<Grid size={{ md: 4 }}>
					<Typography variant="h4" gutterBottom>
						<CurrencyExchangeIcon fontSize="large" style={{ width: '100%' }} /><br />
						Forex &amp; Crypto
					</Typography>
					<Typography variant="body1" gutterBottom>
						We support a wide range of asset classes including Forex and Cryptocurrencies.
					</Typography>
				</Grid>
				<Grid size={{ md: 4 }}>
					<Typography variant="h4" gutterBottom>
						<AccountBalanceIcon fontSize="large" style={{ width: '100%' }} /><br />
						Multiple Sources
					</Typography>
					<Typography variant="body1" gutterBottom>
						We fetch data from multiple exchanges and aggregates them to provide the accurate price for any currency pairs.
					</Typography>
				</Grid>
				<Grid size={{ md: 4 }}>
					<Typography variant="h4" gutterBottom>
						<CreditCardIcon fontSize="large" style={{ width: '100%' }} /><br />
						Pay-as-You-Go
					</Typography>
					<Typography variant="body1" gutterBottom>
						Our service is free of charge for low workloads per IP adddress.
						If you exceed the limit, you can purchase a credit to continue using our service.
						(Note: Our service is currently in beta and you can test our service freely in beta period.)
					</Typography>
				</Grid>
			</Grid>
			<Typography variant="h3" gutterBottom>Use</Typography>
			<Typography variant="h4" gutterBottom>For Developers</Typography>
			<div>
				<p>We provide REST APIs and WebSocket streams for developers.</p>
				<p>The official SDKs can be available at <Link href="https://github.com/janom-inc/pricefeed-public" target="_blank">GitHub</Link>.</p>
			</div>
			<Typography variant="h4" gutterBottom>Google Sheet</Typography>
			<div>
				<p>You can import exchange rate in your Google Sheet (or Microsoft Excel).</p>
				<CopyBlock text="=IMPORTDATA(&quot;https://api.pricefeed.info/v1/price/BASE-QUOTE.txt&quot;)" language="text" theme={dracula} />
				<p>Just replace &quot;BASE&quot; and &quot;QUOTE&quot; to any your favorite asset name! For example,</p>
				<CopyBlock text="=IMPORTDATA(&quot;https://api.pricefeed.info/v1/price/EUR-USD.txt&quot;)" language="text" theme={dracula} />
				<p>will give you the latest EUR/USD exchange rate.</p>
			</div>
		</div>
	);
}
