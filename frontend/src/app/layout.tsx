
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { GoogleAnalytics } from '@next/third-parties/google'
import {
	Container,
	Link,
} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';

import Menu from '@/components/Menu';

import theme from '../theme';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<Menu />
						<Container maxWidth="lg">
							<div style={{
								marginTop: '2rem',
							}}>
								{children}
							</div>
							<hr
								style={{
									margin: '2rem 0',
								}}
								/>
							<footer>
								<p>
									Copyright &copy; {new Date().getFullYear()} <Link href="https://pricefeed.info/">PriceFeed.info</Link> by <Link href="https://janom.co.jp/" target="_blank">Janom LLC</Link>.
									All rights reserved.
								</p>
							</footer>
						</Container>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
			<GoogleAnalytics gaId="G-4GMGN06F6D" />
		</html>
	);
}
