import { NextResponse } from "next/server";
import { INITIAL_FORUM_POSTS } from "@/lib/store";

let forumPosts = [...INITIAL_FORUM_POSTS];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

  let list = [...forumPosts];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw)
    );
  }

  return NextResponse.json({ posts: list, total: list.length });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, postId, title, content, author, authorRole, category, commentText } = body;

    if (action === "upvote" && postId) {
      const post = forumPosts.find((p) => p.id === Number(postId));
      if (post) {
        post.upvotes = (post.upvotes || 0) + 1;
        return NextResponse.json({ success: true, post });
      }
    }

    if (action === "comment" && postId && commentText) {
      const post = forumPosts.find((p) => p.id === Number(postId));
      if (post) {
        const newComment = {
          id: Date.now(),
          author: author || "Peer Student",
          content: commentText,
          createdAt: new Date().toISOString(),
        };
        post.comments = post.comments || [];
        post.comments.push(newComment);
        return NextResponse.json({ success: true, comment: newComment });
      }
    }

    if (title && content) {
      const newPost = {
        id: Date.now(),
        title,
        content,
        author: author || "Campus Candidate",
        authorRole: authorRole || "Computer Science Student",
        category: category || "Placements",
        upvotes: 1,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      forumPosts.unshift(newPost);
      return NextResponse.json({ success: true, post: newPost });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
