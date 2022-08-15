import * as ts from "typescript";

import { RuntimeDefinition } from "./runtime";
import { isRuntimeDefinition, toRuntimeNode } from "./runtime/utils";
import { TypeDefinition } from "./type";
import { isTypeDefinition, toTypeNode } from "./type/utils";

export type AnyDefinition = RuntimeDefinition | TypeDefinition;

/**
 * Create a single line comment.
 *
 * @param definition The type definition.
 * @param comment The single line comment.
 */
export function comment<T extends AnyDefinition>(
	definition: T,
	comment: string
): T extends TypeDefinition ? ts.TypeNode : ts.Node;
/**
 * Create comment spanning multiple lines.
 *
 * @param definition The type definition.
 * @param comment An array of strings, constituting a multiline comment.
 */
export function comment<T>(
	definition: T,
	comment: Array<string>
): T extends TypeDefinition ? ts.TypeNode : ts.Node;
export function comment(definition: AnyDefinition, value: string | Array<string>) {
	const node = isTypeDefinition(definition) ? toTypeNode(definition) : toRuntimeNode(definition);

	const comment = Array.isArray(value) ? `*\n * ${value.join("\n * ")}\n ` : `* ${value} `;
	ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, comment, true);

	return node;
}
