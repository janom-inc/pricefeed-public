
import {
	IPair,
	ExchangeRate,
} from '.';

/**
 * Requests (for WebSockets).
 */

export interface RequestData<T extends string, P> {
	type: T;
	payload: P;
}

export interface RequestBase<M extends string, T extends string, P> {
	id?: number;
	method: M;
	data: RequestData<T, P>;
}

export type RequestPing = Omit<RequestBase<'ping', 'dummy', unknown>, 'data'>;

export type RequestSubscribe<T extends string, P> = RequestBase<'subscribe', T, P>;

// PathElement.toString()[].
export type RequestSubscribeRates = RequestSubscribe<'rates', string[]>;

// Pair.toString().
export type RequestSubscribePrice = RequestSubscribe<'price', string>;

export type Request = RequestPing | RequestSubscribeRates | RequestSubscribePrice;

/**
 * Responses.
 */

export interface ResponseStatus {
	success: boolean;
	duration: number;
	time: number;
	message?: string;
}

export interface ResponseStatusError extends ResponseStatus {
	success: false;
	message: string;
}

export interface RestStatusSuccess extends ResponseStatus {
	success: true;
	message: undefined;
}

export interface ResponseData<T extends string, P> {
	type: T,
	payload: P,
}

export interface ResponseBase<T extends string, P> {
	id?: number;
	status: ResponseStatus;
	data: ResponseData<T, P>;
}

export interface ResponseError extends Omit<ResponseBase<'dummy', unknown>, 'data'> {
	status: ResponseStatusError;
}

export interface ResponseSuccess<T extends string, P> extends ResponseBase<T, P> {
	status: RestStatusSuccess;
}

export type ResponsePing = ResponseSuccess<'pong', undefined>;

export type ResponseRate = ResponseSuccess<'rate', ExchangeRate>;

export type ResponseRates = ResponseSuccess<'rates', ExchangeRate[]>;

export type ResponseRoute = ResponseSuccess<'route', string[]>;

export interface ResponsePayloadPriceSource {
	path: string;
	price: number;
	weight: number;
}

export interface ResponsePayloadPrice {
	price: number;
	pair: IPair,
	sources: ResponsePayloadPriceSource[],
}

export type ResponsePrice = ResponseSuccess<'price', ResponsePayloadPrice>;

export type Response = ResponsePing | ResponseRates | ResponsePrice;
