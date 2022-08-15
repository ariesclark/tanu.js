import * as ts from "typescript";

import { TypeDefinition } from "..";
import { toTypeNode } from "../utils";
/**
 * @param definitions An array of type definitions.
 */
export function intersection(definitions: Array<TypeDefinition>): ts.IntersectionTypeNode {
	return ts.factory.createIntersectionTypeNode(definitions.map(toTypeNode));
}
