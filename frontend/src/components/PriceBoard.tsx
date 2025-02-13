
import {
	Component,
} from 'react';

import {
	Grid2 as Grid,
	Divider,
} from '@mui/material';

import {
	Rate,
} from '@pricefeed/sdk';

import Price, { numberToHR } from '@/components/Price'

export interface PriceBoardProps {
	pair: string;
	price: Rate;
}

export default class PriceBoard extends Component<PriceBoardProps> {
	
	public static BLINK_DURATION = 500;
	public static BLINK_COLOR = 'red';
	public static NORMAL_COLOR = 'black';
	
	private _timeoutId: {
		bid?: ReturnType<typeof setTimeout>,
		ask?: ReturnType<typeof setTimeout>,
	} = {};
	private _prevPriceHR = {
		bid: '',
		ask: '',
	};
	
	private _setBlinkOff(bidOrAsk: 'bid' | 'ask') {
		const id = `priceboard-${this.props.pair}-${bidOrAsk}`;
		if(this._timeoutId[bidOrAsk]) {
			clearTimeout(this._timeoutId[bidOrAsk]);
		}
		this._timeoutId[bidOrAsk] = setTimeout(() => {
			document.getElementById(id)?.style.setProperty('color', PriceBoard.NORMAL_COLOR);
		}, PriceBoard.BLINK_DURATION);
	}
	
	private _getColor(bidOrAsk: 'bid' | 'ask'): string {
		const id = `priceboard-${this.props.pair}-${bidOrAsk}`;
		const priceHR = numberToHR(this.props.price[bidOrAsk]);
		const color = (() => {
			if(!document.getElementById(id)) {
				this._setBlinkOff(bidOrAsk);
				return PriceBoard.BLINK_COLOR;
			}
			if(document.getElementById(id)!.style.getPropertyValue('color') === PriceBoard.BLINK_COLOR) {
				return PriceBoard.BLINK_COLOR;
			} else if(document.getElementById(id)!.style.getPropertyValue('color') === PriceBoard.NORMAL_COLOR) {
				if(priceHR === this._prevPriceHR[bidOrAsk]) {
					return PriceBoard.NORMAL_COLOR;
				} else {
					this._setBlinkOff(bidOrAsk);
					return PriceBoard.BLINK_COLOR;
				}
			} else {
				return PriceBoard.NORMAL_COLOR;
			}
		})();
		this._prevPriceHR[bidOrAsk] = priceHR;
		return color;
	}
	
	render() {
		const [base, quote] = this.props.pair.split('-');
		return (
			<div style={{
				textAlign: 'center',
				border: '1px solid black',
			}}>
				<div style={{
					backgroundColor: '#ddd',
				}}>
					{base} / {quote}
				</div>
				<Divider color="black" />
				<div style={{
					backgroundColor: '#eee',
				}}>
					<Grid container spacing={2}>
						<Grid id={`priceboard-${this.props.pair}-bid`} size={6} style={{
							color: this._getColor('bid'),
							borderRight: '1px solid black',
						}}>
							<Price value={this.props.price.bid} />
						</Grid>
						<Grid id={`priceboard-${this.props.pair}-ask`} size={6} style={{
							color: this._getColor('ask'),
						}}>
							<Price value={this.props.price.ask} />
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
	
}
