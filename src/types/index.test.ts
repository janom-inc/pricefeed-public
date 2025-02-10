
import {
	Pair,
	PathElement,
	Path,
	CloseEventFallback,
} from './index';

describe('types', () => {
	describe('Pair', () => {
		test('toString()', () => {
			expect(new Pair('BTC', 'USD').toString()).toBe('BTC-USD');
		});
		test('fromString(\'BTC-USD\')', () => {
			expect(Pair.fromString('BTC-USD')).toEqual(new Pair('BTC', 'USD'));
		});
		test('fromString(\'BTC\')', () => {
			expect(() => Pair.fromString('BTC')).toThrow('Invalid pair string: BTC');
		});
		test('fromString(\'BTC-USDT-USDC\')', () => {
			expect(() => Pair.fromString('BTC-USDT-USDC')).toThrow('Invalid pair string: BTC-USDT-USDC');
		});
	});
	describe('PathElement', () => {
		test('toString()', () => {
			expect(new PathElement('source', new Pair('BTC', 'USD')).toString()).toBe('source:BTC-USD');
		});
		test('fromString(\'source:BTC-USD\')', () => {
			expect(PathElement.fromString('source:BTC-USD')).toEqual(new PathElement('source', new Pair('BTC', 'USD')));
		});
		test('fromString(\'sourceBTC-USD\')', () => {
			expect(() => PathElement.fromString('sourceBTC-USD')).toThrow('Invalid source and pair string: sourceBTC-USD');
		});
		test('fromString(\'source:BTCUSD\')', () => {
			expect(() => PathElement.fromString('source:BTCUSD')).toThrow('Invalid pair string: BTCUSD');
		});
		test('fromString(\'source:BTC-USD:ETH-USD\')', () => {
			expect(() => PathElement.fromString('source:BTC-USD:ETH-USD')).toThrow('Invalid source and pair string: source:BTC-USD:ETH-USD');
		});
		test('fromString(\'source:BTC-ETH-USD\')', () => {
			expect(() => PathElement.fromString('source:BTC-ETH-USD')).toThrow('Invalid pair string: BTC-ETH-USD');
		});
	});
	describe('Path', () => {
		test('toString(): source:BTC-USD', () => {
			expect(new Path(
				new PathElement('source', new Pair('BTC', 'USD')),
			).toString()).toBe('source:BTC-USD');
		});
		test('toString(): source1:BTC-USD,source2:ETH-USD', () => {
			expect(new Path(
				new PathElement('source1', new Pair('BTC', 'USD')),
				new PathElement('source2', new Pair('ETH', 'USD')),
			).toString()).toBe('source1:BTC-USD,source2:ETH-USD');
		});
		test('fromString(\'source:BTC-USD\')', () => {
			expect(Path.fromString('source:BTC-USD')).toEqual(new Path(
				new PathElement('source', new Pair('BTC', 'USD')),
			));
		});
		test('fromString(\'source1:BTC-USD,source2:ETH-USD\')', () => {
			expect(Path.fromString('source1:BTC-USD,source2:ETH-USD')).toEqual(new Path(
				new PathElement('source1', new Pair('BTC', 'USD')),
				new PathElement('source2', new Pair('ETH', 'USD')),
			));
		});
	});
	describe('CloseEventFallback', () => {
		test('constructor()', () => {
			expect(new CloseEventFallback('event')).toBeInstanceOf(CloseEventFallback);
		});
		test('constructor({})', () => {
			expect(new CloseEventFallback('event', {})).toBeInstanceOf(CloseEventFallback);
		});
	});
});
