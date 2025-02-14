export function configureCors(frontendUrl: string) {
	return {
		origin: [frontendUrl],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	};
}
