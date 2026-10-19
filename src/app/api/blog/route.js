import { NextResponse } from "next/server";
import { INITIAL_BLOG_POSTS } from "@/lib/store";

let blogPosts = [...INITIAL_BLOG_POSTS];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const id = searchParams.get("id");

  if (id) {
    const post = blogPosts.find((p) => p.id === Number(id));
    if (post) return NextResponse.json(post);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let list = [...blogPosts];
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.summary.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw)
    );
  }

  return NextResponse.json({ posts: list, total: list.length });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, postId } = body;

    if (action === "like" && postId) {
      const post = blogPosts.find((p) => p.id === Number(postId));
      if (post) {
        post.likes = (post.likes || 0) + 1;
        return NextResponse.json({ success: true, likes: post.likes });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
