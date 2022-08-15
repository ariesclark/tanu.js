import * as ts from "typescript";

import { TypeDefinition } from "..";
import { toTypeNode } from "../utils";

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
			? definitions.map(toTypeNode)
			: Object.entries(definitions).map(([key, value]) => {
					return ts.factory.createNamedTupleMember(
						undefined,
						ts.factory.createIdentifier(key),
						undefined,
						toTypeNode(value)
					);
			  })
	);
}
