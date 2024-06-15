import * as ts from "typescript";

import { reference, type TypeDefinition } from "../type";
import { toTypeNode } from "../type/utils";

import { toRuntimeNode } from "./utils";

import type { Primitive } from "../utils";

export type ReferenceLike = ts.EnumDeclaration | ts.VariableStatement;

export interface RuntimeDefinitionObject {
	[K: string]: RuntimeDefinition;
}

export type RuntimeDefinition =
	| ReferenceLike
	| RuntimeDefinitionObject
	| Primitive
	| ts.Node;

export * from "./statements";

export function propertyOf(
	definition: RuntimeDefinition,
	key: string
): ts.PropertyAccessExpression;
export function propertyOf(
	definition: RuntimeDefinition,
	key: number
): ts.ElementAccessExpression;
export function propertyOf(
	definition: RuntimeDefinition,
	key: string | number
) {
	const node = toRuntimeNode(definition) as ts.Expression;

	if (typeof key === "number")
		return ts.factory.createElementAccessExpression(node, key);
	return ts.factory.createPropertyAccessExpression(node, key);
}

export function as(
	definition: RuntimeDefinition,
	type: (TypeDefinition & {}) | "const"
) {
	return ts.factory.createAsExpression(
		toRuntimeNode(definition) as ts.Expression,
		type === "const" ? reference("const") : toTypeNode(type)
	);
}
