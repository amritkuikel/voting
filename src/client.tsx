import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

const Sentry = {
	init: () => {},
};

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	sendDefaultPii: true,
});
startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>,
	);
});
