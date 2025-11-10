export interface ApiResponse<T> {
	data: T;
	message: string;
	error: boolean;
}
export interface ApiCallOptions<T> {
	method: "get" | "post" | "put" | "delete" | "patch";
	endpoint: string;
	fallbackValue: T | undefined;
	body?: unknown;
	successTranslationKey?: string;
	errorTranslationKey?: string;
	showAlert?: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	id: number;
	token: string;
}

export interface JwtPayload {
	sub: string;
	roles: string[];
	exp: number;
}
