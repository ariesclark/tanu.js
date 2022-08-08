import * as ts from "typescript";

import { toNode } from "../utils";

import { undefined as undefined_ } from "./primitives";

export * from "./primitives";

export type TypeReferenceLike =
	| ts.TypeNode
	| ts.TypeAliasDeclaration
	| ts.InterfaceDeclaration
	| ts.EnumDeclaration;

export type TypeDefinitionPlain = string | number | boolean;

/**
 * An object, with type definitions as values.
 */
export interface TypeDefinitionObject {
	[K: string]: TypeDefinition;
}

export type TypeDefinition = TypeReferenceLike | TypeDefinitionObject | TypeDefinitionPlain;

/**
 * "interface" is a reserved keyword.
 */
export { interface_ as interface };

/**
 * Create an interface. Used to describe the shape
 * of objects, and can be extended by others.
 *
 * @param name The name of the interface.
 * @param properties An object, with type definitions as values.
 */
function interface_(name: string, properties: TypeDefinitionObject): ts.InterfaceDeclaration {
	return ts.factory.createInterfaceDeclaration(
		undefined,
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		undefined,
		undefined,
		Object.entries(properties).map(([key, node]) => {
			return property(key, node);
		})
	);
}

/**
 * Create an explicit type.
 *
 * @param name The type name.
 * @param definition The type definition.
 */
export function type(name: string, definition: TypeDefinition): ts.TypeAliasDeclaration {
	return ts.factory.createTypeAliasDeclaration(
		undefined,
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		undefined,
		toNode(definition)
	);
}

/**
 * "enum" is a reserved keyword.
 */
export { enum_ as enum };

/**
 * Create an enum (uses the [enum type](https://www.typescriptlang.org/docs/handbook/enums.html) by default)
 *
 * @param name The name of the enum.
 * @param values An array of enum members.
 */
function enum_(name: string, values: Array<string>): ts.EnumDeclaration {
	return ts.factory.createEnumDeclaration(
		undefined,
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		values.map((value) => ts.factory.createEnumMember(value, undefined))
	);
}

/**
 * Create a reference to another type, this is primarily used
 * internally but can be used to refer to types that aren't within scope.
 *
 * @param node A string to create a artificial reference of.
 * @param typeArguments The generic parameters to pass to the referenced type.
 */
export function reference(node: string, typeArguments?: Array<TypeDefinition>): ts.TypeNode;
/**
 * Create a reference to another type, this is primarily used
 * internally but can be used to refer to types that aren't within scope.
 *
 * @param node A node that can be referenced.
 * @param typeArguments The generic parameters to pass to the referenced type.
 */
export function reference(
	node: TypeReferenceLike,
	typeArguments?: Array<TypeDefinition>
): ts.TypeNode;
export function reference(
	node: TypeReferenceLike | string,
	typeArguments: Array<TypeDefinition> = []
): ts.TypeNode {
	if (typeof node === "string")
		return ts.factory.createTypeReferenceNode(node, typeArguments.map(toNode));

	if (ts.isTypeNode(node)) return node;

	return ts.factory.createTypeReferenceNode(node.name, typeArguments.map(toNode));
}

/**
 * Create a single line comment.
 *
 * @param definition The type definition.
 * @param comment The single line comment.
 */
export function comment(definition: TypeDefinition, comment: string): ts.TypeNode;
/**
 * Create comment spanning multiple lines.
 *
 * @param definition The type definition.
 * @param comment An array of strings, constituting a multiline comment.
 */
export function comment(definition: TypeDefinition, comment: Array<string>): ts.TypeNode;
export function comment(definition: TypeDefinition, value: string | Array<string>): ts.TypeNode {
	const node = toNode(definition);

	const comment = Array.isArray(value) ? `*\n * ${value.join("\n * ")}\n ` : `* ${value} `;
	ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, comment, true);

	return node;
}

/**
 * Create a property signature, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param name The property name.
 * @param definition The type definition.
 */
export function property(name: string, definition: TypeDefinition): ts.PropertySignature {
	const node = toNode(definition);

	const optional = ts.isUnionTypeNode(node)
		? node.types.find((value) => value.kind === ts.SyntaxKind.UndefinedKeyword) &&
		  ts.factory.createToken(ts.SyntaxKind.QuestionToken)
		: undefined;

	const propertyComments = ts.getSyntheticLeadingComments(node) ?? [];
	if (propertyComments.length !== 0) ts.setSyntheticLeadingComments(node, []);

	const tsPropertySignature = ts.factory.createPropertySignature(undefined, name, optional, node);

	return propertyComments.length !== 0
		? ts.setSyntheticLeadingComments(tsPropertySignature, propertyComments)
		: tsPropertySignature;
}

/**
 * Describe a type which is one of many
 * options, for example a list of known strings.
 *
 * @example
 * t.type("Size", t.union(["small", "medium", "large"]));
 *
 * @param definitions An array of type definitions.
 */
export function union(definitions: Array<TypeDefinition>): ts.UnionTypeNode {
	return ts.factory.createUnionTypeNode(definitions.map(toNode));
}

/**
 * Create an array type from a type definition.
 * @param definition The type definition.
 */
export function array(definition: TypeDefinition) {
	return ts.factory.createTypeReferenceNode("Array", [toNode(definition)]);
}

/**
 * Shorthand for marking a property as optional,
 * this is equivalent to ``t.union([definition, t.undefined()])``.
 *
 * @param definition The type definition to mark as optional.
 */
export function optional(definition: TypeDefinition) {
	return union([definition, undefined_()]);
}

/**
 * Create an tuple from array of type definitions.
 * A tuple is a special-cased array with known types at specific indexes.
 *
 * @param definitions An array of type definitions.
 */
export function tuple(definitions: Array<TypeDefinition>): ts.TupleTypeNode;
/**
 * Create a named tuple from an definition object.
 * @param definitions An object, with the property keys used as the tuple entry name.
 */
export function tuple(definitions: Record<string, TypeDefinition>): ts.TupleTypeNode;
export function tuple(
	definitions: Array<TypeDefinition> | Record<string, TypeDefinition>
): ts.TupleTypeNode {
	return ts.factory.createTupleTypeNode(
		Array.isArray(definitions)
			? definitions.map(toNode)
			: Object.entries(definitions).map(([key, value]) => {
					return ts.factory.createNamedTupleMember(
						undefined,
						ts.factory.createIdentifier(key),
						undefined,
						toNode(value)
					);
			  })
	);
}

/**
 * Create a literal type, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param definition A plain type definition, like a number or a boolean.
 */
export function literal(definition: TypeDefinitionPlain): ts.LiteralTypeNode;
/**
 * Create a type literal, this is primarily used
 * internally and does not have much usage outside of that.
 *
 * @param definition A object type definition.
 */
export function literal(definition: TypeDefinitionObject): ts.TypeLiteralNode;
export function literal(definition: TypeDefinition): ts.LiteralTypeNode | ts.TypeLiteralNode {
	if (typeof definition === "string")
		return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(definition));
	if (typeof definition === "number")
		return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(definition));
	if (typeof definition === "boolean")
		return ts.factory.createLiteralTypeNode(
			definition ? ts.factory.createTrue() : ts.factory.createFalse()
		);

	return ts.factory.createTypeLiteralNode(
		Array.isArray(definition)
			? definition
			: Object.entries(definition).map(([key, node]) => {
					return property(key, node);
			  })
	);
}
