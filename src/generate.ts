import fs from "node:fs/promises";

import * as ts from "typescript";
export interface GenerateOptions {
	banner?: string;
}

function getDefaultBanner(): string {
	return `/* eslint-disable */
// Generated using Tanu.js (https://github.com/ariesclark/tanu.js)
// Content generated is licensed under the MIT License.
`;
}

/**
 * Generate the file source as a string.
 * @param nodes An array of nodes.
 */
export async function generate(
	nodes: Array<ts.Node>,
	options: GenerateOptions = {}
): Promise<string> {
	options.banner ??= getDefaultBanner();

	const file = ts.createSourceFile("", "", ts.ScriptTarget.ESNext, true);
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	return new Promise((resolve, reject) => {
		try {
			setImmediate(() => {
				const printedNodes = printer.printList(
					ts.ListFormat.MultiLine,
					ts.factory.createNodeArray(nodes),
					file
				);

				resolve(`${options.banner}\n${printedNodes}`);
			});
		} catch (reason) {
			reject(reason);
		}
	});
}

export async function generateFile(
	path: string,
	nodes: Array<ts.Node>,
	options: GenerateOptions = {}
): Promise<void> {
	const source = await generate(nodes, options);
	await fs.writeFile(path, source, "utf8");
}
