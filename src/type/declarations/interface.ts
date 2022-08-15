import * as ts from "typescript";

import { TypeDefinitionObject } from "..";
import { typeProperty } from "../utils";

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
			return typeProperty(key, node);
		})
	);
}
