export const printQueryAsTable = (
	rows: Record<string, unknown | string | number | Date | null | undefined>[],
) => {
	if (rows.length === 0) {
		console.log("No rows to print");
		return;
	}
	const newRows = convertToString(rows);

	const lengthPerColumn = getColumnMaxLength(newRows);

	const totalWidth =
		lengthPerColumn.reduce((acc, curr) => acc + curr, 0) +
		lengthPerColumn.length;

	console.log("\n".padEnd(totalWidth + lengthPerColumn.length + 2, "-"));
	printHeader(newRows[0], lengthPerColumn);
	printRows(newRows, lengthPerColumn);

	console.log("".padEnd(totalWidth + lengthPerColumn.length + 1, "-"));
};

const convertToString = (
	rows: Record<string, unknown | string | number | Date | null | undefined>[],
): Record<keyof (typeof rows)[number], string>[] => {
	const newRows: Record<keyof (typeof rows)[number], string>[] = [];

	rows.forEach((row, index) => {
		Object.entries(row).forEach(([key, value]) => {
			if (!newRows[index]) {
				newRows[index] = {};
			}
			if (value instanceof Date) {
				newRows[index][key] = value.toISOString();
			} else {
				newRows[index][key] = String(value);
			}
		});
	});

	return newRows;
};

const getColumnMaxLength = (rows: Record<string, string>[]) => {
	const maxLengths: number[] = [];

	rows.forEach((row) => {
		Object.entries(row).forEach(([key, value], index) => {
			if (maxLengths[index]) {
				maxLengths[index] = Math.max(
					maxLengths[index],
					value.length,
					key.length,
				);
			} else {
				maxLengths[index] = Math.max(value.length, key.length);
			}
		});
	});

	return maxLengths.map((length) => length + 1);
};

const printHeader = (row: Record<string, string>, maxWidths: number[]) => {
	const keys = Object.keys(row);

	let header = "| ";
	let devider = "|-";

	keys.forEach((key, index) => {
		header += key.padEnd(maxWidths[index]) + "| ";
		devider +=
			"".padEnd(maxWidths[index], "-") +
			(index === keys.length - 1 ? "|" : "|-");
	});

	console.log(header);
	console.log(devider);
};

const printRows = (rows: Record<string, string>[], maxWidths: number[]) => {
	rows.forEach((row, index) => {
		const values = Object.values(row);
		let line = "| ";

		values.forEach((value, index) => {
			line += value.padEnd(maxWidths[index]) + "| ";
		});
		console.log(line);
	});
};
