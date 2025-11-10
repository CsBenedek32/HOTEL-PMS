import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import App from "./App.tsx";
import { initializeAPI } from "./api/api.ts";
import init18n from "./i18n/index.ts";

(async () => {
	try {
		init18n();
		await initializeAPI();
	} catch (_error) {
		const rootElement = document.getElementById("root");
		if (rootElement === null) {
			console.log("Root element is missing! Bailing out");
			return;
		}
		createRoot(rootElement).render(
			<React.StrictMode>
				<div>
					<h3>
						Something unexpected happened. The application failed to start.
					</h3>
				</div>
			</React.StrictMode>,
		);
	}

	const rootElement = document.getElementById("root");
	if (rootElement === null) {
		console.log("Root element is missing! Bailing out");
		return;
	}

	createRoot(rootElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
})();
