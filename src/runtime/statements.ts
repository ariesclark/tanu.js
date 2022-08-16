import * as ts from "typescript";

import { toRuntimeNode } from "./utils";

import { RuntimeDefinition } from ".";

export type VariableStatementKind = "const" | "let" | "var";

export interface VariableStatementOptions {
	type?: ts.TypeNode;
	kind: VariableStatementKind;
}

function variableStatement(
	name: string,
	definition: RuntimeDefinition,
	options: VariableStatementOptions
): ts.VariableStatement {
	const node = toRuntimeNode(definition);

	return ts.factory.createVariableStatement(
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[ts.factory.createVariableDeclaration(name, undefined, options.type, node as ts.Expression)],
			{
				const: ts.NodeFlags.Const,
				let: ts.NodeFlags.Let,
				var: ts.NodeFlags.None
			}[options.kind]
		)
	);
}

/**
 * "const" is a reserved keyword.
 */
export { const_ as const };

function const_(
	name: string,
	definition: RuntimeDefinition,
	options: Omit<VariableStatementOptions, "kind"> = {}
): ts.VariableStatement {
	return variableStatement(name, definition, { ...options, kind: "const" });
}

/**
 * "let" is a reserved keyword.
 */
export { let_ as let };

function let_(
	name: string,
	definition: RuntimeDefinition,
	options: Omit<VariableStatementOptions, "kind"> = {}
): ts.VariableStatement {
	return variableStatement(name, definition, { ...options, kind: "let" });
}

/**
 * "var" is a reserved keyword.
 */
export { var_ as var };

function var_(
	name: string,
	definition: RuntimeDefinition,
	options: Omit<VariableStatementOptions, "kind"> = {}
): ts.VariableStatement {
	return variableStatement(name, definition, { ...options, kind: "var" });
}
