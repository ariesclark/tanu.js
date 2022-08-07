import * as ts from "typescript";

import {
	literal,
	reference,
	TypeDefinition,
	TypeDefinitionPlain,
	TypeReferenceLike
} from "./types";

export function isTypeDefinitionPlain(value: unknown): value is TypeDefinitionPlain {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

export function isNode(value: unknown): value is ts.Node {
	return (
		typeof value === "object" &&
		value !== null &&
		"kind" in value &&
		!!ts.SyntaxKind[(value as ts.Node).kind]
	);
}

export function isTypeReferenceLike(value: unknown): value is TypeReferenceLike {
	return (
		isNode(value) &&
		(ts.isTypeNode(value) ||
			ts.isTypeAliasDeclaration(value) ||
			ts.isInterfaceDeclaration(value) ||
			ts.isEnumDeclaration(value))
	);
}

export function toNode(definition: TypeDefinition): ts.TypeNode {
	return isTypeReferenceLike(definition)
		? reference(definition)
		: // @todo: this type cast is a lie, but typescript complained about overloads.
		  literal(definition as TypeDefinitionPlain);
}
