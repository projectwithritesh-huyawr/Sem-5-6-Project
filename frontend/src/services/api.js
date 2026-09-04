const configuredApiBase = import.meta.env.VITE_API_BASE_URL;

const developmentApiBase = `${window.location.protocol}//${window.location.hostname}/library-main/backend/api`;
const productionApiBase = "/backend/api";

export const API_BASE = configuredApiBase || (
	import.meta.env.DEV ? developmentApiBase : productionApiBase
);

export function apiUrl(endpoint) {
	return `${API_BASE.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}
