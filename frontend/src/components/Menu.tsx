'use client';

import * as React from 'react';
import Image from 'next/image';
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu as MuiMenu,
	MenuItem,
	Button,
	Container,
} from '@mui/material';
import {
	Menu as MenuIcon,
} from '@mui/icons-material';

const pages = [
	{
		title: 'Pricing',
		href: '/pricing',
	},
];

export default function Menu() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	
	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	
	return (
		<AppBar position="static" color="primary">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Image
						alt="logo"
						src="/img/logo/logo.svg"
						style={{
							maxWidth: '40px',
							marginRight: '20px',
						}}
						/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						PriceFeed.info
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<MuiMenu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{pages.map((page) => (
								<MenuItem key={page.title} onClick={handleCloseNavMenu}>
									<Typography
										component="a"
										href={page.href}
										sx={{
											textAlign: 'center',
											textDecoration: 'none',
										}}
									>
										{page.title}
									</Typography>
								</MenuItem>
							))}
						</MuiMenu>
					</Box>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						PriceFeed.info
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
								<Button
									href={page.href}
									key={page.title}
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									{page.title}
								</Button>
						))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
