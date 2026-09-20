import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import embeds from "@/data/embeds.json";

type Entry = {
  title: string;
  slug: string;
  category: string;
  file: string;
  source: string;
  embeds: number;
};

const entries = embeds as Entry[];

const prettyCategory = (c: string) =>
  c
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\bgmes\b/i, "All Games")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cool G@mes Archive — Every Embed, Sorted" },
      {
        name: "description",
        content:
          "A browsable archive of every Cool G@mes embed, grouped into category folders and ready to play.",
      },
      { property: "og:title", content: "Cool G@mes Archive — Every Embed, Sorted" },
      {
        property: "og:description",
        content:
          "A browsable archive of every Cool G@mes embed, grouped into category folders and ready to play.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (e) => e.title.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q),
        )
      : entries;
    const map = new Map<string, Entry[]>();
    for (const e of filtered) {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Archive</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Cool G@mes</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            {entries.length} embeds pulled from the original site and filed into category
            folders. Tap any title to launch it.
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games…"
            className="mt-6 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:max-w-sm"
          />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        {groups.map(([category, list]) => (
          <section key={category} className="mb-12">
            <h2 className="text-lg font-bold tracking-tight">{prettyCategory(category)}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              public/embeds/{category} · {list.length} entries
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <li key={e.category + e.slug}>
                  <a
                    href={e.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring hover:bg-accent"
                  >
                    <span className="font-semibold leading-snug">{e.title}</span>
                    <span className="mt-2 text-xs text-muted-foreground">
                      {e.embeds > 1 ? `${e.embeds} embeds` : "1 embed"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground">No games match that search.</p>
        )}
      </div>
    </main>
  );
}
