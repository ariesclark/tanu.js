import test from "ava";
import * as ts from "typescript";

import { t } from "../src";

test("string", (tc) => {
	const stringKeyword = t.string();
	tc.is(stringKeyword.kind, ts.SyntaxKind.StringKeyword);
});

test("number", (tc) => {
	const numberKeyword = t.number();
	tc.is(numberKeyword.kind, ts.SyntaxKind.NumberKeyword);
});

test("boolean", (tc) => {
	const BooleanKeyword = t.boolean();
	tc.is(BooleanKeyword.kind, ts.SyntaxKind.BooleanKeyword);
});

test("date", (tc) => {
	const dateType = t.date();
	tc.is(dateType.kind, ts.SyntaxKind.TypeReference);
});

test("any", (tc) => {
	const anyType = t.any();
	tc.is(anyType.kind, ts.SyntaxKind.AnyKeyword);
});

test("unknown", (tc) => {
	const unknownType = t.unknown();
	tc.is(unknownType.kind, ts.SyntaxKind.UnknownKeyword);
});

test("undefined", (tc) => {
	const undefinedType = t.undefined();
	tc.is(undefinedType.kind, ts.SyntaxKind.UndefinedKeyword);
});

test("void", (tc) => {
	const voidType = t.void();
	tc.is(voidType.kind, ts.SyntaxKind.VoidKeyword);
});

test("never", (tc) => {
	const neverType = t.never();
	tc.is(neverType.kind, ts.SyntaxKind.NeverKeyword);
});

test("bigint", (tc) => {
	const bigintType = t.bigint();
	tc.is(bigintType.kind, ts.SyntaxKind.BigIntKeyword);
});

// Null not yet supported

// test("null", (tc) => {
// 	const nullType = t.null();
// 	tc.is(nullType.kind, ts.SyntaxKind.NullKeyword);
// });

// Symbol not yet supported
// test("symbol", (tc) => {
// 	const symbolType = t.symbol();
// 	tc.is(symbolType.kind, ts.SyntaxKind.SymbolKeyword);
// });
