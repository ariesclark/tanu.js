import * as ts from "typescript";

import { ReferenceLike } from "../runtime";
import { runtimeReference } from "../runtime/utils";
import { Primitive } from "../utils";

import { toTypeNode, typeLiteral } from "./utils";

export * from "./composites";
export * from "./declarations";
export * from "./modifiers";
export * from "./primitives";

/**
 * A value that can be referenced within
 * the scope of a type definition.
 */
export type TypeReferenceLike =
	| ts.TypeNode
	| ts.TypeAliasDeclaration
	| ts.InterfaceDeclaration
	| ts.EnumDeclaration;

/**
 * An object, with type definitions as values.
 */
export interface TypeDefinitionObject {
	[K: string]: TypeDefinition;
}

export type TypeDefinition = TypeReferenceLike | TypeDefinitionObject | Primitive;

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
		return ts.factory.createTypeReferenceNode(node, typeArguments.map(toTypeNode));

	if (ts.isTypeNode(node)) return node;

	return ts.factory.createTypeReferenceNode(node.name, typeArguments.map(toTypeNode));
}

/**
 * Create an array type from a type definition.
 * @param definition The type definition.
 */
export function array(definition: TypeDefinition) {
	return ts.factory.createTypeReferenceNode("Array", [toTypeNode(definition)]);
}

/**
 * "typeof" is a reserved keyword.
 */
export { typeof_ as typeof };

function typeof_(value: ReferenceLike) {
	return ts.factory.createTypeQueryNode(runtimeReference(value));
}

export function indexOf(definition: TypeDefinition, index: string | number) {
	return ts.factory.createIndexedAccessTypeNode(toTypeNode(definition), typeLiteral(index));
}
