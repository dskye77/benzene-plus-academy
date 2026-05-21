/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import tutorImg from "@/assets/tutor-teaching.jpg";
import { toast } from "sonner";

// Pretend function for fetching a single blog post by slug
// async function fetchBlogPost(slug) { ... }
import { fetchBlogPost } from "@/lib/client/blogs"; // Assuming this exists

export default function BlogSubpage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params || {};

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBlog() {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await fetchBlogPost(slug);
        if (!data) {
          if (isMounted) setNotFound(true);
        } else {
          if (isMounted) setBlog(data);
        }
      } catch (err) {
        if (isMounted) setNotFound(true);
        toast.error?.("Failed to load blog post. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) loadBlog();
    else setLoading(false);

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <span className="text-5xl mb-4 animate-bounce">📰</span>
        <h2 className="text-2xl font-bold mb-2">Loading blog...</h2>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <span className="text-5xl mb-4">🤷‍♂️</span>
        <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
        <p className="text-center max-w-md">
          The blog post you&apos;re looking for does not exist. <br />
          <Link href="/blog" className="underline text-accent font-semibold">
            Back to blog
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-grid-fade opacity-25" />

        <div className="relative container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Blog & news
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            {blog.title}
          </h1>
          <div className="mt-3 text-muted-foreground text-sm">
            {blog.date &&
              new Date(blog.date).toLocaleDateString("en-NG", {
                dateStyle: "long",
              })}
            {blog.category ? (
              <>
                <span className="mx-2">&middot;</span>
                <span>{blog.category}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-8">
          <Image
            src={blog.image || tutorImg}
            alt={blog.title}
            width={880}
            height={420}
            priority
            className="rounded-2xl w-full max-h-[420px] object-cover"
          />
        </div>
        <article className="prose md:prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
          {blog.body ? (
            <div dangerouslySetInnerHTML={{ __html: blog.body }} />
          ) : (
            <p>No content available.</p>
          )}
        </article>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            ← Back to blog
          </Link>
        </div>
      </section>
    </>
  );
}
