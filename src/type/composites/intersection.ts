import * as ts from "typescript";

import { toTypeNode } from "../utils";

import type { TypeDefinition } from "..";
/**
 * @param definitions An array of type definitions.
 */
export function intersection(
	definitions: Array<TypeDefinition>
): ts.IntersectionTypeNode {
	return ts.factory.createIntersectionTypeNode(definitions.map(toTypeNode));
}
