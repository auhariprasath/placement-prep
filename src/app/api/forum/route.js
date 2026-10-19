import { NextResponse } from "next/server";
import { INITIAL_FORUM_POSTS } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

let memoryForumPosts = [...INITIAL_FORUM_POSTS];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("forum_posts")
        .select("*, comments:forum_comments(*)")
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        query = query.ilike("category", category);
      }
      if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ posts: data, total: data.length, source: "supabase" });
      }
      console.warn("Supabase forum fetch error, using memory fallback:", error?.message);
    } catch (e) {
      console.warn("Supabase query exception:", e.message);
    }
  }

  // Fallback to in-memory store
  let list = [...memoryForumPosts];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw)
    );
  }

  return NextResponse.json({ posts: list, total: list.length, source: "memory" });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, postId, title, content, author, authorRole, category, commentText } = body;

    // Upvote
    if (action === "upvote" && postId) {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: current } = await supabase
            .from("forum_posts")
            .select("upvotes")
            .eq("id", postId)
            .single();

          const newUpvotes = (current?.upvotes || 0) + 1;
          const { data, error } = await supabase
            .from("forum_posts")
            .update({ upvotes: newUpvotes })
            .eq("id", postId)
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json({ success: true, post: data });
          }
        } catch (e) {
          console.warn("Supabase upvote error:", e.message);
        }
      }

      const post = memoryForumPosts.find((p) => p.id === Number(postId));
      if (post) {
        post.upvotes = (post.upvotes || 0) + 1;
        return NextResponse.json({ success: true, post });
      }
    }

    // Comment
    if (action === "comment" && postId && commentText) {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("forum_comments")
            .insert({
              post_id: postId,
              author: author || "Peer Student",
              content: commentText,
            })
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json({ success: true, comment: data });
          }
        } catch (e) {
          console.warn("Supabase comment error:", e.message);
        }
      }

      const post = memoryForumPosts.find((p) => p.id === Number(postId));
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

    // Create New Post
    if (title && content) {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("forum_posts")
            .insert({
              title,
              content,
              author: author || "Campus Candidate",
              author_role: authorRole || "Computer Science Student",
              category: category || "Placements",
              upvotes: 1,
            })
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json({ success: true, post: data });
          }
        } catch (e) {
          console.warn("Supabase post error:", e.message);
        }
      }

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
      memoryForumPosts.unshift(newPost);
      return NextResponse.json({ success: true, post: newPost });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
