import { createClient } from '@supabase/supabase-js';
import { Article, Comment } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * Indicates whether Supabase cloud environment variables are properly initialized.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Global Supabase Client Instance
 * Configured via environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY).
 * Protected by PostgreSQL Row Level Security (RLS) policies.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key'
);

/**
 * BullMonk Supabase Storage Engine
 * High-performance browser-native file and image uploads to Supabase Buckets.
 */
export const SupabaseStorage = {
  /**
   * Upload an image, document, or PDF to a Supabase bucket
   * @param bucket - The storage bucket name (e.g., 'articles', 'documents', 'media')
   * @param path - Target storage path (e.g., 'uploads/report.pdf')
   * @param file - File or Blob object
   */
  async uploadFile(bucket: string, path: string, file: File | Blob) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined
      });

    if (error) throw error;
    return data;
  },

  /**
   * Retrieve the permanent public URL for a file in a public bucket
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Download a file blob from a bucket
   */
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw error;
    return data;
  },

  /**
   * List files within a bucket path
   */
  async listFiles(bucket: string, path = '') {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) throw error;
    return data;
  },

  /**
   * Delete files from a bucket
   */
  async removeFiles(bucket: string, paths: string[]) {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
    return data;
  }
};

/**
 * BullMonk Supabase Database Engine
 * Real-time synchronization for global reader comments and custom articles.
 */
export const SupabaseDB = {
  /**
   * Fetch reader dialogue comments for a specific article
   */
  async fetchComments(articleId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((c: any) => ({
        id: c.id,
        author: c.author,
        affiliation: c.affiliation,
        timeAgo: new Date(c.created_at).toLocaleDateString(),
        content: c.content,
        likes: c.likes || 0
      }));
    } catch (e) {
      return [];
    }
  },

  /**
   * Submit an institutional reader comment to Supabase
   */
  async addComment(articleId: string, comment: Comment): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          id: comment.id,
          article_id: articleId,
          author: comment.author,
          affiliation: comment.affiliation,
          content: comment.content,
          likes: comment.likes
        });

      return !error;
    } catch (e) {
      return false;
    }
  },

  /**
   * Fetch custom dynamic articles from Supabase
   */
  async fetchArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error || !data) return [];

      return data.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        region: a.region,
        deck: a.deck || '',
        content: a.content,
        keyTakeaways: a.key_takeaways || [],
        author: a.author,
        publishedAt: a.published_at,
        readTime: a.read_time || '5 min read',
        heroImage: a.hero_image,
        imageCaption: a.image_caption,
        tags: a.tags || [],
        views: a.views || 0,
        bookmarks: a.bookmarks || 0,
        userCreated: true
      }));
    } catch (e) {
      return [];
    }
  },

  /**
   * Save a newly drafted article to Supabase
   */
  async saveArticle(article: Article): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('articles')
        .insert({
          id: article.id,
          slug: article.slug,
          title: article.title,
          category: article.category,
          region: article.region,
          deck: article.deck,
          content: article.content,
          key_takeaways: article.keyTakeaways,
          author: article.author,
          published_at: article.publishedAt,
          read_time: article.readTime,
          hero_image: article.heroImage,
          image_caption: article.imageCaption,
          tags: article.tags,
          views: article.views,
          bookmarks: article.bookmarks
        });

      return !error;
    } catch (e) {
      return false;
    }
  },

  /**
   * Delete an article from Supabase
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      return !error;
    } catch (e) {
      return false;
    }
  },

  /**
   * Fetch all comments for editorial moderation
   */
  async fetchAllComments(): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data) return [];
      return data.map((c: any) => ({
        id: c.id,
        author: c.author,
        affiliation: c.affiliation,
        timeAgo: new Date(c.created_at).toLocaleDateString(),
        content: c.content,
        likes: c.likes || 0
      }));
    } catch (e) {
      return [];
    }
  },

  /**
   * Batch synchronize newsroom articles to Supabase database
   */
  async syncAllArticles(articles: Article[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    for (const a of articles) {
      try {
        const { error } = await supabase
          .from('articles')
          .upsert({
            id: a.id,
            slug: a.slug,
            title: a.title,
            category: a.category,
            region: a.region,
            deck: a.deck,
            content: a.content,
            key_takeaways: a.keyTakeaways,
            author: a.author,
            published_at: a.publishedAt,
            read_time: a.readTime,
            hero_image: a.heroImage,
            image_caption: a.imageCaption,
            tags: a.tags,
            views: a.views,
            bookmarks: a.bookmarks
          }, { onConflict: 'id' });
        if (error) failed++;
        else success++;
      } catch {
        failed++;
      }
    }
    return { success, failed };
  },

  /**
   * Delete a comment by ID (for admin moderation)
   */
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      return !error;
    } catch (e) {
      return false;
    }
  }
};
