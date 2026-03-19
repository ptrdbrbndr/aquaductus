import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const supabase = await createClient()
    const { data: post } = await supabase
      .from('blog_posts')
      .select('seo_titel, seo_beschrijving, titel, samenvatting')
      .eq('slug', slug)
      .eq('gepubliceerd', true)
      .single()

    if (!post) return {}
    return {
      title: post.seo_titel ?? `${post.titel} — Aquaductus`,
      description: post.seo_beschrijving ?? post.samenvatting,
    }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('gepubliceerd', true)
    .single()

  if (!post) notFound()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titel,
    description: post.samenvatting,
    datePublished: post.gepubliceerd_op,
    publisher: {
      '@type': 'Organization',
      name: 'Aquaductus',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-white pt-20 pb-16" data-testid="blog-post">
        <article className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            {post.gepubliceerd_op && (
              <time className="font-body text-text-light text-sm">
                {format(new Date(post.gepubliceerd_op), 'd MMMM yyyy', { locale: nl })}
              </time>
            )}
            <h1 className="font-display text-4xl sm:text-5xl text-text-primary mt-2 mb-4">
              {post.titel}
            </h1>
            {post.samenvatting && (
              <p className="font-body text-text-light text-lg leading-relaxed border-l-4 border-water pl-4">
                {post.samenvatting}
              </p>
            )}
          </div>
          <div className="prose prose-lg max-w-none font-body text-text-primary leading-relaxed">
            {post.inhoud?.split('\n').map((alinea: string, idx: number) => (
              alinea.trim() ? <p key={idx} className="mb-4">{alinea}</p> : null
            ))}
          </div>
        </article>
      </main>
    </>
  )
}
