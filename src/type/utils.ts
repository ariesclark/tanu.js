import * as ts from "typescript";

import { isNode, isPrimitive, type Primitive } from "../utils";
import { runtimeLiteral } from "../runtime/utils";

import {
	reference,
	type TypeDefinition,
	type TypeDefinitionObject,
	type TypeReferenceLike
} from ".";

export function isTypeReferenceLike(
	value: unknown
): value is TypeReferenceLike {
	return (
		isNode(value) &&
		(ts.isTypeNode(value) ||
			ts.isTypeAliasDeclaration(value) ||
			ts.isInterfaceDeclaration(value) ||
			ts.isEnumDeclaration(value))
	);
}

export function isTypeDefinitionObject(
	object: unknown
): object is TypeDefinitionObject {
	if (typeof object !== "object" || !object) return false;

	for (const value of Object.values(object)) {
		if (!isTypeDefinition(value)) return false;
	}

	return true;
}

export function isTypeDefinition(value: unknown): value is TypeDefinition {
	return (
		isTypeReferenceLike(value) ||
		isTypeDefinitionObject(value) ||
		isPrimitive(value)
	);
}

export function toTypeNode(definition: TypeDefinition): ts.TypeNode {
	return isTypeReferenceLike(definition)
		? reference(definition)
		: typeLiteral(definition);
}

/**
 * Create a property signature, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param name The property name.
 * @param definition The type definition.
 */
export function typeProperty(
	name: string,
	definition: TypeDefinition
): ts.PropertySignature {
	const node = toTypeNode(definition);

	const optional = ts.isUnionTypeNode(node)
		? node.types.find(
				(value) => value.kind === ts.SyntaxKind.UndefinedKeyword
			) && ts.factory.createToken(ts.SyntaxKind.QuestionToken)
		: undefined;

	const modifiers: Array<ts.Modifier> = [];
	if (
		ts.isTypeReferenceNode(node) &&
		ts.isIdentifier(node.typeName) &&
		node.typeName.escapedText === "Readonly"
	)
		modifiers.push(ts.factory.createToken(ts.SyntaxKind.ReadonlyKeyword));

	const propertyComments = ts.getSyntheticLeadingComments(node) ?? [];
	if (propertyComments.length > 0) ts.setSyntheticLeadingComments(node, []);

	const tsPropertySignature = ts.factory.createPropertySignature(
		modifiers.length > 0 ? modifiers : undefined,
		name,
		optional,
		node
	);

	return propertyComments.length > 0
		? ts.setSyntheticLeadingComments(tsPropertySignature, propertyComments)
		: tsPropertySignature;
}

/**
 * Create a literal type, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param definition A primitive, like a number or a boolean.
 */
export function typeLiteral(definition: Primitive): ts.LiteralTypeNode;
/**
 * Create a type literal, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param definition A object type definition.
 */
export function typeLiteral(
	definition: TypeDefinitionObject
): ts.TypeLiteralNode;
export function typeLiteral(
	definition: TypeDefinitionObject | Primitive
): ts.LiteralTypeNode | ts.TypeLiteralNode;
export function typeLiteral(definition: TypeDefinitionObject | Primitive) {
	if (isPrimitive(definition))
		return ts.factory.createLiteralTypeNode(runtimeLiteral(definition));

	return ts.factory.createTypeLiteralNode(
		Object.entries(definition).map(([key, node]) => {
			return typeProperty(key, node);
		})
	);
}
