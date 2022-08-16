import * as ts from "typescript";

import { isNode, isPrimitive, Primitive } from "../utils";

import { RuntimeDefinition, RuntimeDefinitionObject, ReferenceLike } from ".";

export type BooleanRuntimeLiteral = ts.TrueLiteral | ts.FalseLiteral;
export type PrimitiveRuntimeLiteral =
	| ts.StringLiteral
	| ts.NumericLiteral
	| BooleanRuntimeLiteral
	| ts.BigIntLiteral;

export function isReferenceLike(value: unknown): value is ReferenceLike {
	return isNode(value) && (ts.isEnumDeclaration(value) || ts.isVariableStatement(value));
}

export function isRuntimeDefinitionObject(object: unknown): object is RuntimeDefinitionObject {
	if (typeof object !== "object" || !object) return false;

	for (const value of Object.values(object)) {
		if (!isRuntimeDefinition(value)) return false;
	}

	return true;
}

export function isRuntimeDefinition(value: unknown): value is RuntimeDefinition {
	return isReferenceLike(value) || isRuntimeDefinitionObject(value) || isPrimitive(value);
}

export function toRuntimeNode(definition: RuntimeDefinition, reference: boolean = true) {
	if (reference && isReferenceLike(definition)) return runtimeReference(definition);
	return isNode(definition) ? definition : runtimeLiteral(definition);
}

export function runtimeReference(definition: ReferenceLike) {
	const name = ts.isVariableStatement(definition)
		? (definition.declarationList.declarations[0].name as ts.Identifier).text
		: definition.name.text;

	return ts.factory.createIdentifier(name);
}

/**
 * Create a property signature, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param name The property name.
 * @param definition The type definition.
 */
export function runtimeProperty(
	name: string,
	definition: RuntimeDefinition
): ts.PropertyAssignment {
	const node = toRuntimeNode(definition);

	const propertyComments = ts.getSyntheticLeadingComments(node) ?? [];
	if (propertyComments.length !== 0) ts.setSyntheticLeadingComments(node, []);

	const tsPropertySignature = ts.factory.createPropertyAssignment(
		runtimeLiteral(name),
		node as ts.Expression
	);

	return propertyComments.length !== 0
		? ts.setSyntheticLeadingComments(tsPropertySignature, propertyComments)
		: tsPropertySignature;
}

/**
 * Create a literal type, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param definition A primitive, like a number or a boolean.
 */
export function runtimeLiteral(definition: string): ts.StringLiteral;
export function runtimeLiteral(definition: number): ts.NumericLiteral;
export function runtimeLiteral(definition: boolean): BooleanRuntimeLiteral;
export function runtimeLiteral(definition: Primitive): PrimitiveRuntimeLiteral;
export function runtimeLiteral(definition: RuntimeDefinitionObject): ts.ObjectLiteralExpression;
export function runtimeLiteral(
	definition: RuntimeDefinitionObject | Primitive
): PrimitiveRuntimeLiteral | ts.ObjectLiteralExpression;
export function runtimeLiteral(definition: RuntimeDefinitionObject | Primitive) {
	if (typeof definition === "string") return ts.factory.createStringLiteral(definition);
	if (typeof definition === "number") return ts.factory.createNumericLiteral(definition);
	if (typeof definition === "boolean")
		return (definition ? ts.factory.createTrue : ts.factory.createFalse)();
	if (typeof definition === "bigint") return ts.factory.createBigIntLiteral(definition.toString());

	return ts.factory.createObjectLiteralExpression(
		Object.entries(definition).map(([key, node]) => {
			return runtimeProperty(key, node);
		}),
		true
	);
}
