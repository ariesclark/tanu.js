import test from "ava";
import * as ts from "typescript";

import { runtimeLiteral, runtimeReference } from "../src/runtime/utils";
import { t } from "../src";

test("string", async (tc) => {
	const stringLiteral = runtimeLiteral("hello");
	tc.is(stringLiteral.kind, ts.SyntaxKind.StringLiteral);
	const result = await t.generate([stringLiteral], { banner: "" });
	tc.is(result, '\n"hello"\n');
});

test("numeric", async (tc) => {
	const numberLiteral = runtimeLiteral(1);
	tc.is(numberLiteral.kind, ts.SyntaxKind.NumericLiteral);
	const result = await t.generate([numberLiteral], { banner: "" });
	tc.is(result, "\n1\n");
});

test("numeric - nan", async (tc) => {
	const nanLiteral = runtimeLiteral(Number.NaN);
	tc.is(nanLiteral.kind, ts.SyntaxKind.NumericLiteral);
	const result = await t.generate([nanLiteral], { banner: "" });
	tc.is(result, "\nNaN\n");
});

test("numeric - infinity", async (tc) => {
	const infinityLiteral = runtimeLiteral(Infinity);
	tc.is(infinityLiteral.kind, ts.SyntaxKind.NumericLiteral);
	const result = await t.generate([infinityLiteral], { banner: "" });
	tc.is(result, "\nInfinity\n");
});

test("boolean - true", async (tc) => {
	const trueLiteral = runtimeLiteral(true);
	tc.is(trueLiteral.kind, ts.SyntaxKind.TrueKeyword);
	const result = await t.generate([trueLiteral], { banner: "" });
	tc.is(result, "\ntrue\n");
});

test("boolean - false", async (tc) => {
	const falseLiteral = runtimeLiteral(false);
	tc.is(falseLiteral.kind, ts.SyntaxKind.FalseKeyword);
	const result = await t.generate([falseLiteral], { banner: "" });
	tc.is(result, "\nfalse\n");
});

// TODO: Will not execute for ES2016 target. Requires ES2020 or higher.
// test("bigint", async (tc) => {
// 	const bigintLiteral = runtimeLiteral(200n);
// 	tc.is(bigintLiteral.kind, ts.SyntaxKind.BigIntLiteral);
// 	const result = await t.generate([bigintLiteral], { banner: "" });
// 	tc.is(result, "\n200\n");
// });

const expectedObjectResult = `
{
    "foo": "bar",
    "baz": 1
}
`;

test("object", async (tc) => {
	const objectLiteral = runtimeLiteral({ foo: "bar", baz: 1 });
	tc.is(objectLiteral.kind, ts.SyntaxKind.ObjectLiteralExpression);
	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedObjectResult);
});

const expectedNestedObjectResult = `
{
    "foo": "bar",
    "baz": {
        "qux": 1
    }
}
`;

test("object - nested", async (tc) => {
	const objectLiteral = runtimeLiteral({ foo: "bar", baz: { qux: 1 } });
	tc.is(objectLiteral.kind, ts.SyntaxKind.ObjectLiteralExpression);
	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedNestedObjectResult);
});

test("reference - enum", async (tc) => {
	const myEnum = t.enum("MyEnum", ["foo", "bar", "baz"]);
	const enumReference = runtimeReference(myEnum);
	tc.is(enumReference.kind, ts.SyntaxKind.Identifier);

	const result = await t.generate([enumReference], { banner: "" });
	tc.is(result, "\nMyEnum\n");
});

test("reference - variable", async (tc) => {
	const variableStatement = t.var("myVariable", {});
	const typeReference = runtimeReference(variableStatement);
	tc.is(typeReference.kind, ts.SyntaxKind.Identifier);

	const result = await t.generate([typeReference], { banner: "" });
	tc.is(result, "\nmyVariable\n");
});

const expectedObjectLiteralWithVariableResult = `
{
    "foo": myVariable
}
`;

const expectedObjectLiteralWithEnumResult = `
{
    "foo": MyEnum
}
`;

test("object - with enum reference", async (tc) => {
	const enumDeclaration = t.enum("MyEnum", ["foo", "bar", "baz"]);
	const objectLiteral = runtimeLiteral({
		foo: enumDeclaration
	});

	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedObjectLiteralWithEnumResult);
});

test("object - with variable reference", async (tc) => {
	const variableStatement = t.const("myVariable", {});
	const objectLiteral = runtimeLiteral({
		foo: variableStatement
	});

	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedObjectLiteralWithVariableResult);
});

const expectedObjectLiteralWithUndefinedNodeResult = `
{
    "foo": undefined
}
`;

test("object - with node property", async (tc) => {
	const objectLiteral = runtimeLiteral({
		foo: ts.factory.createIdentifier("undefined")
	});

	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedObjectLiteralWithUndefinedNodeResult);
});

const expectedObjectLiteralPropertyWithComment = `
{
    /** My variable comment */
    "foo": bar
}
`;

test("object - property with existing leading comments", async (tc) => {
	const bar = t.comment(t.var("bar", {}), "My variable comment");
	const objectLiteral = runtimeLiteral({
		foo: bar
	});
	const result = await t.generate([objectLiteral], { banner: "" });
	tc.is(result, expectedObjectLiteralPropertyWithComment);
});

// TODO: Add support for runtime literal arrays

test("propertyOf - string key", async (tc) => {
	const myObject = t.let("myObject", {
		foo: "bar"
	});
	const propertyOf = t.propertyOf(myObject, "foo");
	tc.is(propertyOf.kind, ts.SyntaxKind.PropertyAccessExpression);
	const result = await t.generate([propertyOf], { banner: "" });
	tc.is(result, "\nmyObject.foo\n");
});

test("propertyOf - number key", async (tc) => {
	const myObject = t.let("myObject", {
		1: "bar"
	});
	const propertyOf = t.propertyOf(myObject, 1);
	tc.is(propertyOf.kind, ts.SyntaxKind.ElementAccessExpression);
	const result = await t.generate([propertyOf], { banner: "" });
	tc.is(result, "\nmyObject[1]\n");
});

// TODO: propertyCall/propertyCallOf ?

test("as", async (tc) => {
	const myVariable = t.var("myVariable", {});
	const as = t.as(myVariable, t.string());
	tc.is(as.kind, ts.SyntaxKind.AsExpression);
	const result = await t.generate([as], { banner: "" });
	tc.is(result, "\nmyVariable as string\n");
});
