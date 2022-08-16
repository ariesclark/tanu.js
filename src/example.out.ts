/* eslint-disable */
// Generated using Tanu.js (https://github.com/ariesclark/tanu.js)
// Content generated is licensed under the MIT License.

export interface User {
    id: number;
    name: string;
    username: string;
    emails: {
        0: string;
        1: string;
    };
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}
export enum MemberRole {
    DEFAULT,
    SPONSOR,
    ADMINISTRATOR
}
export interface Member {
    user: User;
    role: MemberRole;
}
export interface Organization {
    readonly id: Readonly<number>;
    /**
     * The organization name
     * @see https://example.com/organization-name
     */
    name: string;
    description?: string | undefined;
    members: Array<Member>;
}
export type Foo = 1 & 2;
const a = MemberRole.DEFAULT;
const b = {
    "foo": {
        "bar/baz": true
    }
} as const;
export type B = (typeof b)["foo"];
export interface RecursiveInterface {
    foo: RecursiveInterface;
}
