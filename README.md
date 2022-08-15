# Tanu 🦝

A simplified abstraction of the TypeScript Compiler API for defining and generating source files.

[![npm](https://img.shields.io/npm/v/tanu)](https://npm.im/tanu) [![GitHub issues](https://img.shields.io/github/issues/ariesclark/tanu.js) ![GitHub Repo stars](https://img.shields.io/github/stars/ariesclark/tanu.js?style=social)](https://github.com/ariesclark/tanu.js)

- [Tanu 🦝](#tanu-)
  - [Why?](#why)
  - [What does Tanu mean? 🦝](#what-does-tanu-mean-)
  - [How do I use this?](#how-do-i-use-this)

### Why?

I've always hated the fact that the majority of packages generate TypeScript files from a [ridiculously long template literal string](https://github.com/prisma/prisma/blob/44e1a8d16d62db62fbe8cc9c3e7ed0801617227a/packages/client/src/generation/TSClient/PrismaClient.ts), It's not type safe or even readable at all, and I saw a cool tweet.

<a href="https://twitter.com/mattpocockuk/status/1554766319165358081"><img src="https://i.imgur.com/5oDLeJn.png" width="50%"/></a>

Yes Matt, It does exist now.

### What does Tanu mean? 🦝

[Tanuki (a cute animal)](https://en.wikipedia.org/wiki/Japanese_raccoon_dog) but I removed the last two characters cause `tanuki` was already taken on npm, and sounded cool enough for me. _Naming things is hard, okay?_

### How do I use this?

```ts
const User = t.interface("User", {
  id: t.number(),
  email: t.string(),
  name: t.optional({
    first: t.string(),
    last: t.string(),
  }),
});

const MemberRole = t.enum("MemberRole", [
  "DEFAULT",
  "PRIVILEGED",
  "ADMINISTRATOR",
]);

const Member = t.interface("Member", {
  user: User,
  role: MemberRole,
});

const Organization = t.interface("Organization", {
  name: t.comment(t.string(), [
    "The organization name.",
    "@see https://example.com/organization-name",
  ]),
  description: t.optional(t.string()),
  members: t.array(Member),
});

const result = await t.generate([User, MemberRole, Member, Organization]);
console.log(result);
```

```ts
// the generated result.

export interface User {
  id: number;
  email: string;
  name?:
    | {
        first: string;
        last: string;
      }
    | undefined;
}
export enum MemberRole {
  DEFAULT,
  PRIVILEGED,
  ADMINISTRATOR,
}
export interface Member {
  user: User;
  role: MemberRole;
}
export interface Organization {
  /**
   * The organization name.
   * @see https://example.com/organization-name
   */
  name: string;
  description?: string | undefined;
  members: Array<Member>;
}
```

### What about interfaces that reference themselves, or cross-reference each other?

Passing in a callback to the `t.interface` method will lazily populate the interface with its returned values. This will ensure that you can self-reference or cross-reference the interface, and it will be available by generation.

```ts
import { t } from "tanu.js";

const User = t.interface("User", () => ({
  users: t.array(User),
  posts: t.array(Post),
  authoredComments: t.array(Comment),
}));

const Post = t.interface("Post", () => ({
  author: User,
  text: t.string(),
  images: t.array(t.string()),
  postComments: t.array(Comment),
}));

const Comment = t.interface("Comment", {
  author: User,
  post: Post,
  text: t.string(),
});

const CommentReply = t.type("CommentReply", () => ({
  parent: CommentReply,
  author: User,
  post: Post,
  text: t.string(),
}));

const result = await t.generate([User, Post, Comment, CommentReply]);
console.log(result);
```

```ts
// the generated result

export interface User {
  users: Array<User>;
  posts: Array<Post>;
  authoredComments: Array<Comment>;
}
export interface Post {
  author: User;
  text: string;
  images: Array<string>;
  postComments: Array<Comment>;
}
export interface Comment {
  author: User;
  post: Post;
  text: string;
}
export type CommentReply = {
  parent: CommentReply;
  author: User;
  post: Post;
  text: string;
};
```
