import * as ts from "typescript";

import { reference, TypeDefinition } from "../type";
import { toTypeNode } from "../type/utils";
import { Primitive } from "../utils";

import { toRuntimeNode } from "./utils";

export type ReferenceLike = ts.EnumDeclaration | ts.VariableStatement;

export interface RuntimeDefinitionObject {
	[K: string]: RuntimeDefinition;
}

export type RuntimeDefinition = ReferenceLike | RuntimeDefinitionObject | Primitive | ts.Node;

export * from "./statements";

export function propertyOf(definition: RuntimeDefinition, key: string): ts.PropertyAccessExpression;
export function propertyOf(definition: RuntimeDefinition, key: number): ts.ElementAccessExpression;
export function propertyOf(definition: RuntimeDefinition, key: string | number) {
	const node = toRuntimeNode(definition) as ts.Expression;

	if (typeof key === "number") return ts.factory.createElementAccessExpression(node, key);
	return ts.factory.createPropertyAccessExpression(node, key);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function as(definition: RuntimeDefinition, type: (TypeDefinition & {}) | "const") {
	return ts.factory.createAsExpression(
		toRuntimeNode(definition) as ts.Expression,
		type === "const" ? reference("const") : toTypeNode(type)
	);
}
