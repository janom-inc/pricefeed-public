
import {
	ExchangeRate,
	RestStatus,
	RestStatusError,
	RestStatusSuccess,
	RestData,
	RestResponse,
	RestResponseError,
	RestResponseSuccess,
	RestResponsePing,
} from '.';

export type WebSocketStatus = RestStatus;
export type WebSocketStatusError = RestStatusError;
export type WebSocketStatusSuccess = RestStatusSuccess;
export type WebSocketData<T extends string, U> = RestData<T, U>;
export interface WebSocketResponse<T extends string, U> extends RestResponse<T, U> {
	id?: number;
}
export interface WebSocketResponseError extends RestResponseError {
	id?: number;
}
export interface WebSocketResponseSuccess<T extends string, U> extends RestResponseSuccess<T, U> {
	id?: number;
}

export interface WebSocketResponsePing extends RestResponsePing {
	id?: number;
}
export interface WebSocketResponseSnapshot extends WebSocketResponseSuccess<'snapshot', ExchangeRate[]> {
	id?: number;
}
export type WebSocketResponseUpdate = Omit<WebSocketResponseSuccess<'update', ExchangeRate[]>, 'id'>;

export interface WebSocketRequestData<T extends string, U> {
	type: T,
	payload: U,
}
export interface WebSocketRequest<T extends string, U> {
	id?: number;
	method: string;
	data?: WebSocketRequestData<T, U>;
}
export interface WebSocketRequestPing extends WebSocketRequest<'', undefined> {
	method: 'ping';
};
export interface WebSocketRequestSubscribe<T extends string, U> extends WebSocketRequest<T, U> {
	method: 'subscribe';
	data: WebSocketRequestData<T, U>;
}
export interface WebSocketRequestSubscribeRates extends WebSocketRequestSubscribe<'rate', string[]> {
}
export interface WebSocketRequestSubscribePrice extends WebSocketRequestSubscribe<'price', string> {
}
