import * as ts from "typescript";

export type Primitive = string | number | boolean | bigint /*| symbol */;

export const PrimitiveTypes = [
	"string",
	"number",
	"boolean",
	"bigint" /*, "symbol" */
] as const;
export type PrimitiveTypes = (typeof PrimitiveTypes)[number];

export function isPrimitive(value: unknown): value is Primitive {
	// @ts-expect-error: Readonly array include wants explicit value.
	return PrimitiveTypes.includes(typeof value);
}

export function isNode(value: unknown): value is ts.Node {
	return (
		typeof value === "object" &&
		value !== null &&
		"kind" in value &&
		!!ts.SyntaxKind[(value as ts.Node).kind]
	);
}

export function setLazy<T extends object>(
	defaultValue: T,
	immediateValue: () => T
) {
	let value = defaultValue;

	setImmediate(() => {
		value = immediateValue();
	});

	return new Proxy(defaultValue, {
		get(_, property, receiver) {
			return Reflect.get(value, property, receiver);
		}
	});
}
