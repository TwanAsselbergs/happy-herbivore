export function formatCurrency(value: number) {
	return new Intl.NumberFormat("nl-NL", {
		style: "currency",
		currency: "EUR",
	})
		.format(value)
		.replace(/\s/g, "");
}
