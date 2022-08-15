import * as ts from "typescript";

import { TypeDefinition } from "..";
import { toTypeNode } from "../utils";

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
		toTypeNode(definition)
	);
}
