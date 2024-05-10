import * as ts from "typescript";

import { TypeDefinitionObject } from "..";
import { setLazy } from "../../utils";
import { typeProperty } from "../utils";

/**
 * Constructs an interface with the given name and properties.
 */
function constructInterface(name: string, properties: TypeDefinitionObject) {
	return ts.factory.createInterfaceDeclaration(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		undefined,
		undefined,
		Object.entries(properties).map(([key, node]) => {
			return typeProperty(key, node);
		})
	);
}

/**
 * "interface" is a reserved keyword.
 */
export { interface_ as interface };

/**
 * Create an interface. Used to describe the shape
 * of objects, and can be extended by others.
 *
 * @param name The name of the interface.
 * @param properties An object, with type definitions as values or a function which lazily returns them.
 */
function interface_(
	name: string,
	properties: TypeDefinitionObject | (() => TypeDefinitionObject)
): ts.InterfaceDeclaration {
	if (typeof properties !== "function") return constructInterface(name, properties);
	return setLazy(constructInterface(name, {}), () => constructInterface(name, properties()));
}
