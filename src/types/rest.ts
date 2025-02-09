
import {
	ExchangeRateWithSource,
} from '.';

export interface RestStatus {
	success: boolean;
	duration: number;
	time: number;
	message?: string;
}

export interface RestStatusError extends RestStatus {
	success: false;
	message: string;
}

export interface RestStatusSuccess extends RestStatus {
	success: true;
	message: undefined;
}

export interface RestData<T extends string, U> {
	type: T,
	payload: U,
}

export interface RestResponse<T extends string, U> {
	status: RestStatus;
	data?: RestData<T, U>;
}

export interface RestResponseError extends RestResponse<'', unknown> {
	status: RestStatusError;
	data: undefined;
}

export interface RestResponseSuccess<T extends string, U> extends RestResponse<T, U> {
	status: RestStatusSuccess;
	data: RestData<T, U>;
}

export type RestResponsePing = RestResponseSuccess<'pong', null>;

export type RestResponseRate = RestResponseSuccess<'rate', ExchangeRateWithSource>;

export type RestResponseRates = RestResponseSuccess<'rates', ExchangeRateWithSource[]>;

export interface RestPayloadSource {
	path: string;
	price: number;
	weight: number;
}

export interface RestPayloadPrice {
	price: number;
	sources: RestPayloadSource[],
}

export type RestResponsePrice = RestResponseSuccess<'price', RestPayloadPrice>;
