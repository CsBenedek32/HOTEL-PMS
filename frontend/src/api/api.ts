import type { AxiosInstance } from "axios";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getEnvConfig } from "../env";
import type {
	ApiCallOptions,
	ApiResponse,
	JwtPayload,
	LoginCredentials,
	LoginResponse,
} from "../interfaces/api";
import {
	errorCodeTranslationKeyAtom,
	errorMessageTranslationKeyAtom,
	successCodeTranslationKeyAtom,
	successMessageTranslationKeyAtom,
} from "../state/operationState";
import { store } from "../state/store";
import { userAtom } from "../state/userState";

export let api: AxiosInstance | undefined;

export async function initializeAPI() {
	if (!api) {
		api = axios.create({
			baseURL: getEnvConfig().appUrl,
		});

		api.interceptors.request.use((config) => {
			const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		api.interceptors.response.use(
			(response) => response,
			(error) => {
				return Promise.reject(error);
			},
		);

		try {
			const res = await api.get("api/init/handshake");
			if (res.status !== 200) throw new Error("API handshake failed");
		} catch (error) {
			console.log("API handshake failed", error);
			localStorage.removeItem("token");
			store.set(userAtom, null);
		}

		console.log("API initialized:");
	}
}

export const login = async (
	credentials: LoginCredentials,
): Promise<ApiResponse<LoginResponse | undefined>> => {
	const response = await apiCall<LoginResponse>({
		method: "post",
		endpoint: "api/auth/login",
		fallbackValue: { id: 0, token: "" },
		body: credentials,
		successTranslationKey: "apiResponses.login.success",
		showAlert: true,
	});

	if (!response.error && response.data?.token) {
		localStorage.setItem("token", response.data.token);

		const decoded = jwtDecode<JwtPayload>(response.data.token);
		store.set(userAtom, {
			email: decoded.sub,
			roles: decoded.roles,
		});
	}

	return response;
};

export const logout = async (): Promise<ApiResponse<void>> => {
	const response = await apiCall<void>({
		method: "post",
		endpoint: "api/auth/logout",
		fallbackValue: undefined,
		successTranslationKey: "apiResponses.logout.success",
		showAlert: true,
	});
	localStorage.removeItem("token");
	store.set(userAtom, null);
	return response;
};

export const register = async (userData: {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
}): Promise<ApiResponse<void>> => {
	const response = await apiCall<void>({
		method: "post",
		endpoint: "api/auth/register",
		fallbackValue: undefined,
		body: userData,
		successTranslationKey: "apiResponses.register.success",
		showAlert: true,
	});

	return response;
};

export async function apiCall<T>(
	options: ApiCallOptions<T>,
): Promise<ApiResponse<T | undefined>> {
	const {
		method,
		endpoint,
		fallbackValue,
		body,
		successTranslationKey,
		errorTranslationKey,
		showAlert = false,
	} = options;

	try {
		if (!api) {
			return {
				data: fallbackValue,
				message: "API not initialized",
				error: true,
			};
		}

		const response =
			method === "get" || method === "delete"
				? await api[method](endpoint)
				: await api[method](endpoint, body);

		const message = response.data.message;

		if (showAlert) {
			store.set(successMessageTranslationKeyAtom, `backendCodes.${message}`);
			if (successTranslationKey)
				store.set(successCodeTranslationKeyAtom, successTranslationKey);
		}

		return {
			data: response.data.data,
			message,
			error: false,
		};
	} catch (err) {
		let data = "API_000";


		if (axios.isAxiosError(err) && err.response) {
			data = err.response.data.data;
		}


		if (showAlert) {
			if (axios.isAxiosError(err) && err.response?.status === 403) {
				store.set(errorMessageTranslationKeyAtom, `backendCodes.API_403`);
			}
			else {
				store.set(errorMessageTranslationKeyAtom, `backendCodes.${data}`);
				if (errorTranslationKey)
					store.set(errorCodeTranslationKeyAtom, errorTranslationKey);
			}
		}

		return {
			data: fallbackValue,
			message: data || "API_000",
			error: true,
		};
	}
}
