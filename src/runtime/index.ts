import * as ts from "typescript";

import { Primitive } from "../utils";

import { toRuntimeNode } from "./utils";

export type ReferenceLike = ts.EnumDeclaration;

export interface RuntimeDefinitionObject {
	[K: string]: RuntimeDefinition;
}

export type RuntimeDefinition = ReferenceLike | RuntimeDefinitionObject | Primitive | ts.Node;

export * from "./statements";

export function propertyOf(definition: RuntimeDefinition, key: string): ts.PropertyAccessExpression;
export function propertyOf(definition: RuntimeDefinition, key: number): ts.ElementAccessExpression;
export function propertyOf(definition: RuntimeDefinition, key: string | number) {
	if (typeof key === "number") return indexOf(definition, key);
	return ts.factory.createPropertyAccessExpression(toRuntimeNode(definition) as ts.Expression, key);
}

export function indexOf(definition: RuntimeDefinition, index: number): ts.ElementAccessExpression {
	return ts.factory.createElementAccessExpression(
		toRuntimeNode(definition) as ts.Expression,
		index
	);
}
