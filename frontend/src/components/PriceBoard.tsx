
import {
	Component,
} from 'react';

import {
	Divider,
} from '@mui/material';

import Price from '@/components/Price'

import { numberToHR } from '@/components/Price';

export interface PriceBoardProps {
	pair: string;
	price: number;
}

export default class PriceBoard extends Component<PriceBoardProps> {
	
	public static BLINK_DURATION = 500;
	public static BLINK_COLOR = 'red';
	public static NORMAL_COLOR = 'black';
	
	private _timeoutId?: ReturnType<typeof setTimeout>;
	private _prevPriceHR: string = '';
	
	private _setBlinkOff(id: string) {
		if(this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		this._timeoutId = setTimeout(() => {
			document.getElementById(id)?.style.setProperty('color', 'black');
		}, PriceBoard.BLINK_DURATION);
	}
	
	render() {
		const [base, quote] = this.props.pair.split('-');
		const priceHR = numberToHR(this.props.price);
		//const color = (this._prevPrice === undefined || this.props.price === this._prevPrice) ? 'black' : this.props.price > this._prevPrice ? 'green' : 'red';
		const id = `priceboard-${this.props.pair}`;
		const color = (() => {
			if(!document.getElementById(id)) {
				this._setBlinkOff(id);
				return PriceBoard.BLINK_COLOR;
			}
			if(document.getElementById(id)!.style.getPropertyValue('color') === PriceBoard.BLINK_COLOR) {
				return PriceBoard.BLINK_COLOR;
			} else if(document.getElementById(id)!.style.getPropertyValue('color') === PriceBoard.NORMAL_COLOR) {
				if(priceHR === this._prevPriceHR) {
					return PriceBoard.NORMAL_COLOR;
				} else {
					this._setBlinkOff(id);
					return PriceBoard.BLINK_COLOR;
				}
			} else {
				return PriceBoard.NORMAL_COLOR;
			}
		})();
		//const color = (this._prevPrice !== undefined || this.props.price !== this._prevPrice) ? 'red': 'black';
		this._prevPriceHR = priceHR;
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
				<div id={id} style={{
					backgroundColor: '#eee',
					color,
				}}>
					<Price value={this.props.price} />
				</div>
			</div>
		);
	}
	
}
