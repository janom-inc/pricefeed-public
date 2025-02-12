'use client';

import * as React from 'react';

import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	MenuItem,
	Avatar,
	Button,
	Tooltip,
	Container,
	Link,
} from '@mui/material';
import {
	Adb as AdbIcon,
	Menu as MenuIcon,
} from '@mui/icons-material';

const pages = [
	{
		title: 'Pricing',
		href: '/pricing',
	},
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
	
	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	
	return (
		<AppBar position="static" color="primary">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<img
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
						<Menu
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
						</Menu>
					</Box>
					<AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="#app-bar-with-responsive-menu"
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
						LOGO
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
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
