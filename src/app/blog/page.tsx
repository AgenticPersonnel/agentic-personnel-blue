import { supabase } from '@/lib/supabase';
import Container from '@/components/ui/Container';

// Revalidate this page every hour so new posts appear without a full redeploy
export const revalidate = 3600;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BlogPost } from '@/types';

function calcReadTime(content: string | null): number {
  if (!content) return 3;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr: string | null, options: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

export default async function BlogPage() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, meta_description, featured_image_url, status, season, publish_date, published_at, content')
    .eq('status', 'published')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Supabase error fetching blog posts:', error);
  }

  const posts: BlogPost[] = data ?? [];
  const featuredPost = posts[0] ?? null;
  const remainingPosts = posts.slice(1);

  const categories = [
    'All',
    ...Array.from(new Set(posts.map((p) => p.season).filter(Boolean))) as string[],
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI Insights for SMBs
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Practical advice, case studies, and strategies to help your business succeed with AI.
            </p>
            <Button variant="outline" size="lg">
              Subscribe to Updates
            </Button>
          </div>
        </Container>
      </section>

      {posts.length === 0 ? (
        /* Empty state */
        <section className="py-24">
          <Container>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Articles coming soon</h2>
              <p className="text-gray-600">
                We&apos;re working on in-depth guides and case studies for SMBs. Check back soon.
              </p>
            </div>
          </Container>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          <section className="py-16">
            <Container>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Article</h2>
              </div>

              <Card className="mb-16 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                    {featuredPost!.featured_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost!.featured_image_url}
                        alt={featuredPost!.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 font-medium">Featured Article Image</span>
                    )}
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      {featuredPost!.season && (
                        <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
                          {featuredPost!.season}
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">
                        {calcReadTime(featuredPost!.content)} min read
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {featuredPost!.title}
                    </h3>
                    {featuredPost!.meta_description && (
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredPost!.meta_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        {formatDate(featuredPost!.publish_date ?? featuredPost!.published_at, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <Button variant="primary" size="md">
                        Read Article
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Container>
          </section>

          {/* Category Filter */}
          {categories.length > 1 && (
            <section className="py-8 bg-white border-b border-gray-200">
              <Container>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === 'All' ? 'primary' : 'ghost'}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Container>
            </section>
          )}

          {/* Blog Posts Grid */}
          {remainingPosts.length > 0 && (
            <section className="py-24">
              <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post) => (
                    <Card key={post.id} className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        {post.featured_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          {post.season && (
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              {post.season}
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">
                            {calcReadTime(post.content)} min read
                          </span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-gray-700 transition-colors leading-tight">
                          {post.title}
                        </CardTitle>
                        {post.meta_description && (
                          <CardDescription>{post.meta_description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">
                            {formatDate(post.publish_date ?? post.published_at, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <Button variant="ghost" size="sm">
                            Read More →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              </Container>
            </section>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss an Update
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get our latest AI insights and strategies delivered to your inbox weekly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <Button variant="primary" size="md">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
