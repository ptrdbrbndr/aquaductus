import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { BlogPost } from '@/lib/types'

export const metadata = {
  title: 'Blog — Aquaductus',
  description: 'Lees onze artikelen over zeilen, coaching en teambuilding op de Randmeren.',
}

export default async function BlogOverzicht() {
  let posts: BlogPost[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('gepubliceerd', true)
      .order('gepubliceerd_op', { ascending: false })
    posts = data ?? []
  } catch {}

  return (
    <main className="min-h-screen bg-mist pt-20 pb-16" data-testid="blog-overzicht">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="font-body text-water text-sm tracking-widest uppercase mb-3">Kennis & inspiratie</p>
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary">Blog</h1>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="font-body text-text-light">Er zijn nog geen artikelen gepubliceerd.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                data-testid="blog-kaart"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-display text-2xl text-text-primary hover:text-water transition-colors">
                    {post.titel}
                  </h2>
                  {post.gepubliceerd_op && (
                    <time
                      dateTime={post.gepubliceerd_op}
                      className="font-body text-text-light text-sm whitespace-nowrap ml-4"
                    >
                      {format(new Date(post.gepubliceerd_op), 'd MMM yyyy', { locale: nl })}
                    </time>
                  )}
                </div>
                {post.samenvatting && (
                  <p className="font-body text-text-light text-sm leading-relaxed">{post.samenvatting}</p>
                )}
                <p className="font-body text-water text-sm mt-3">Lees meer →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
