
export * from './message';

export type Side = 'base' | 'quote';

export interface IPair extends Record<Side, string> {
	base: string;
	quote: string;
}

export class Pair implements IPair {
	
	constructor(public base: string, public quote: string) {}
	
	public toString(): string {
		return `${this.base}-${this.quote}`;
	}
	
	public static fromString(pairStr: string): Pair {
		const [base, quote, ...rest] = pairStr.split('-');
		if(!base || !quote || rest.length > 0) {
			throw new Error(`Invalid pair string: ${pairStr}`);
		}
		return new Pair(base, quote);
	}
	
}

export interface Rate {
	last: number;
	bid: number;
	ask: number;
}

export interface TradingVolume extends Record<Side, number> {
	base: number;
	quote: number;
}

export interface ExchangeRate {
	time: number;
	pair: Pair;
	rate: Rate;
	source: string;
	tradingVolume24h?: TradingVolume;
}

export interface IPathElement {
	source: string;
	pair: IPair;
}

export class PathElement implements IPathElement {
	
	constructor(
		public readonly source: string,
		public readonly pair: Pair,
	) {
	}
	
	public toString(): string {
		return `${this.source}:${this.pair.base}-${this.pair.quote}`;
	}
	
	public static fromString(str: string): PathElement {
		const [source, pairStr, ...rest] = str.split(':');
		if(!source || !pairStr || rest.length > 0) {
			throw new Error(`Invalid source and pair string: ${str}`);
		}
		const [base, quote, ...rest2] = pairStr.split('-');
		if(!base || !quote || rest2.length > 0) {
			throw new Error(`Invalid pair string: ${pairStr}`);
		}
		return new PathElement(source, new Pair(base, quote));
	}
	
}

export type IPath = IPathElement[];

export class Path extends Array<PathElement> {
	
	public toString(): string {
		return this.map((elem) => elem.toString()).join(',');
	}
	
	public static fromString(pathStr: string): Path {
		const elems = pathStr.split(',').map((elemStr) => PathElement.fromString(elemStr));
		return new Path(...elems);
	}
	
};

export type Route = Set<Path>;

// Workaround for CloseEvent not being defined in globalThis (e.g. in Node.js).
export class CloseEventFallback extends Event {
	public readonly code: number;
	public readonly reason: string;
	public readonly wasClean: boolean;
	constructor(type: string, eventInitDict: any = {}) {
		super(type, eventInitDict);
		this.code = eventInitDict.code;
		this.reason = eventInitDict.reason;
		this.wasClean = eventInitDict.wasClean;
	}
}

// Copied from https://zenn.dev/reosablo/articles/2c3624697ebe8d
export declare class TypedEventTarget<EventMap extends Record<string, Event>> extends EventTarget {
	addEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, evt: EventMap[Type]) => void,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		...args: Parameters<EventTarget["addEventListener"]>
	): void;
	removeEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, evt: EventMap[Type]) => void,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		...args: Parameters<EventTarget["removeEventListener"]>
	): void;
}
