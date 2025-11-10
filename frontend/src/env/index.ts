export interface ClientEnv {
	appUrl: string;
	appEnv: string;
}

const config: ClientEnv = {
	appUrl: "http://127.0.0.1:8080/",
	appEnv: "dev",
};

export function getEnvConfig(): ClientEnv {
	return config;
}
