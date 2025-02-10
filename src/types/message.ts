
import {
	ExchangeRate,
} from '.';

/**
 * Requests (for WebSockets).
 */

export interface RequestData<T extends string, P> {
	type: T;
	payload: P;
}

export interface Request<M extends string, T extends string, P> {
	id?: number;
	method: M;
	data?: RequestData<T, P>;
}

export type RequestPing = Request<'ping', 'dummy', unknown>;

export type RequestSubscribe<T extends string, P> = Request<'subscribe', T, P>;

// PathElement.toString()[].
export type RequestSubscribeRates = RequestSubscribe<'rates', string[]>;

// Pair.toString().
export type RequestSubscribePrice = RequestSubscribe<'price', string>;

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

export interface Response<T extends string, P> {
	id?: number;
	status: ResponseStatus;
	data?: ResponseData<T, P>;
}

export interface ResponseError extends Response<'dummy', unknown> {
	status: ResponseStatusError;
	data: undefined;
}

export interface ResponseSuccess<T extends string, P> extends Response<T, P> {
	status: RestStatusSuccess;
	data: ResponseData<T, P>;
}

export type ResponsePing = ResponseSuccess<'pong', undefined>;

export type ResponseRate = ResponseSuccess<'rates', ExchangeRate>;

export type ResponseRates = ResponseSuccess<'rates', ExchangeRate[]>;

export type ResponseRoute = ResponseSuccess<'route', string[]>;

export interface ResponsePayloadPriceSource {
	path: string;
	price: number;
	weight: number;
}

export interface ResponsePayloadPrice {
	price: number;
	sources: ResponsePayloadPriceSource[],
}

export type ResponsePrice = ResponseSuccess<'price', ResponsePayloadPrice>;
