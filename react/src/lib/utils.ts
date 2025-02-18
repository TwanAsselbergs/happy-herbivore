export function formatCurrency(value: number) {
	return new Intl.NumberFormat("nl-NL", {
		style: "currency",
		currency: "EUR",
	})
		.format(value)
		.replace(/\s/g, "");
}

export function toggleFromArray(array: any[], value: any) {
	const index = array.indexOf(value);

	// Copy old array to prevent modifying the original one
	const newArr = [...array];

	if (index === -1) {
		newArr.push(value);
	} else {
		newArr.splice(index, 1);
	}

	return newArr;
}
