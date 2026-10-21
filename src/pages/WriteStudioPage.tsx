import React, { useState } from 'react';
import { Article } from '../types';
import { Sparkles, Eye, Send, Bold, Italic, Heading, Quote, Trash2, ArrowLeft, CheckCircle2, UploadCloud } from 'lucide-react';
import { SupabaseStorage } from '../utils/supabase';

interface WriteStudioPageProps {
  onPublish: (newArticle: Partial<Article>) => void;
  onSelectArticle: (article: Article) => void;
  publishedArticles: Article[];
  onDeleteArticle: (id: string) => void;
  onBackToWire: () => void;
  showToast: (msg: string) => void;
}

export const WriteStudioPage: React.FC<WriteStudioPageProps> = ({
  onPublish,
  onSelectArticle,
  publishedArticles,
  onDeleteArticle,
  onBackToWire,
  showToast
}) => {
  const [title, setTitle] = useState('');
  const [deck, setDeck] = useState('');
  const [category, setCategory] = useState('Markets & Finance');
  const [region, setRegion] = useState('United States');
  const [location, setLocation] = useState('Zurich Bureau');
  const [authorName, setAuthorName] = useState('BullMonk Special Correspondent');
  const [authorTitle, setAuthorTitle] = useState('Senior Macro & Geopolitical Analyst');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80');
  const [imageCaption, setImageCaption] = useState('BullMonk international bureau dispatch.');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Macroeconomics, Global Markets, Central Banks');
  const [breaking, setBreaking] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const filename = `hero-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await SupabaseStorage.uploadFile('media', `articles/${filename}`, file);
      const publicUrl = SupabaseStorage.getPublicUrl('media', `articles/${filename}`);
      setHeroImage(publicUrl);
      showToast('Cover photo uploaded to Supabase Media Bucket!');
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Check storage permissions'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const imagePresets = [
    { label: '📈 Financial Trading', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
    { label: '⚡ Semiconductor Fab', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    { label: '🌐 Global Satellite', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
    { label: '🏛️ London Financial City', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
    { label: '⚛️ Fusion & Green Grid', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80' },
    { label: '📚 Classic Archive', url: 'https://images.unsplash.com/photo-1507842229458-5776106c8252?auto=format&fit=crop&w=1200&q=80' },
  ];

  const insertTag = (tag: 'b' | 'i' | 'h3' | 'quote' | 'p') => {
    let snippet = '';
    if (tag === 'b') snippet = '<strong>Bold Text</strong>';
    else if (tag === 'i') snippet = '<em>Italicized Text</em>';
    else if (tag === 'h3') snippet = '\n<h3>Section Heading</h3>\n';
    else if (tag === 'quote') snippet = '\n<blockquote class="article-quote">\n  "Significant institutional quotation."\n  <cite>— Source Name, Organization</cite>\n</blockquote>\n';
    else if (tag === 'p') snippet = '\n<p>New paragraph of analysis...</p>\n';

    setContent((prev) => prev + snippet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please provide both a Headline and Article Content.');
      return;
    }

    let formattedContent = content;
    if (!formattedContent.includes('<p>')) {
      formattedContent = formattedContent
        .split('\n\n')
        .map((para, i) => `<p class="${i === 0 ? 'lead-paragraph' : ''}">${para.trim()}</p>`)
        .join('\n');
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    onPublish({
      title,
      deck,
      category,
      region: region as any,
      content: formattedContent,
      author: {
        name: authorName,
        title: authorTitle,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        location: location
      },
      heroImage,
      imageCaption,
      tags: tagArray,
      breaking,
      featured: true
    });
  };

  return (
    <main className="container" style={{ margin: '2.5rem auto 5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            className="btn btn-secondary" 
            onClick={onBackToWire}
            style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} /> Back to Global Wire
          </button>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, letterSpacing: '0.04em' }}>
            BullMonk Editorial Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Author, format, and broadcast global investigative reporting directly to the worldwide feed.
          </p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setPreviewMode(!previewMode)}
        >
          <Eye size={16} />
          <span>{previewMode ? 'Back to Editor' : 'Live Reader Preview'}</span>
        </button>
      </div>

      {/* Editor & Preview Grid */}
      <div style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'clamp(1.5rem, 4vw, 2.5rem)', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        {previewMode ? (
          /* Live Preview Mode */
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className={`badge ${breaking ? 'badge-breaking' : 'badge-category'}`}>{category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{location}</span>
            </div>
            <h1 className="article-main-title">{title || 'Untitled Headline'}</h1>
            {deck && <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{deck}</p>}
            
            {heroImage && (
              <figure style={{ margin: '1.5rem 0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img src={heroImage} alt="Preview" style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
                {imageCaption && <figcaption style={{ padding: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{imageCaption}</figcaption>}
              </figure>
            )}

            <div 
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: content || '<p>Start typing in the editor to see your live preview here...</p>' }}
            />
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit}>
            {/* Headline */}
            <div className="form-group">
              <label className="form-label">Story Headline / Title *</label>
              <input 
                type="text" 
                className="form-control"
                style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700 }}
                placeholder="e.g. Sovereign Debt Settlement Protocol Ratified in Zurich"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subdeck */}
            <div className="form-group">
              <label className="form-label">Executive Subdeck / Deck</label>
              <textarea 
                className="form-control" 
                rows={2}
                placeholder="A sharp two-sentence summary framing the geopolitical or financial significance..."
                value={deck}
                onChange={(e) => setDeck(e.target.value)}
              />
            </div>

            {/* Row 1: Category, Region, Bureau, Breaking Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.4rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category Desk *</label>
                <select 
                  className="form-control" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Markets & Finance">Markets & Finance</option>
                  <option value="Technology & AI">Technology & AI</option>
                  <option value="World Affairs">World Affairs</option>
                  <option value="Energy & Climate">Energy & Climate</option>
                  <option value="Culture & Ideas">Culture & Ideas</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Region *</label>
                <select 
                  className="form-control" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="United States">🇺🇸 United States</option>
                  <option value="Europe">🇪🇺 Europe</option>
                  <option value="India">🇮🇳 India</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia & NZ">🇦🇺 Australia & NZ</option>
                  <option value="Russia & Eurasia">🇷🇺 Russia & Eurasia</option>
                  <option value="Global">🌐 Global Macro</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Bureau Location</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Zurich Bureau, London Bureau"
                />
              </div>

              <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label">Priority Level</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                  <input 
                    type="checkbox" 
                    checked={breaking} 
                    onChange={(e) => setBreaking(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-red)' }}
                  />
                  <span style={{ fontWeight: 700, color: breaking ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                    Flag as Breaking Intelligence
                  </span>
                </label>
              </div>
            </div>

            {/* Row 2: Author Bylines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.4rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Author Byline *</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Author Role / Credentials</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Image Cover & Presets */}
            <div className="form-group">
              <label className="form-label">Hero Cover Image URL *</label>
              <input 
                type="url" 
                className="form-control"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                required
              />
              
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '5px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UploadCloud size={14} color="var(--accent-gold)" />
                  <span>{uploadingImage ? 'Uploading to Supabase Media...' : 'Upload Image to Supabase'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage}
                  />
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploads to sovereign cloud bucket or select below</span>
              </div>
              
              <div style={{ marginTop: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Curated Editorial Presets:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.4rem 0' }}>
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="cat-tab"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      onClick={() => setHeroImage(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image Attribution & Caption</label>
              <input 
                type="text" 
                className="form-control"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="e.g. Trading terminals during high-frequency volatility in Frankfurt."
              />
            </div>

            {/* Row 4: Article Body with Formatting Buttons */}
            <div className="form-group">
              <label className="form-label">Article Body Content *</label>
              
              <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface-elevated)', padding: '0.4rem 0.6rem', border: '1px solid var(--border-subtle)', borderBottom: 'none', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}>
                <button type="button" className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => insertTag('b')} title="Bold">
                  <Bold size={13} />
                </button>
                <button type="button" className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => insertTag('i')} title="Italic">
                  <Italic size={13} />
                </button>
                <button type="button" className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => insertTag('h3')} title="Section Heading">
                  <Heading size={13} />
                </button>
                <button type="button" className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => insertTag('quote')} title="Pull Quote">
                  <Quote size={13} />
                </button>
                <button type="button" className="btn-icon" style={{ width: '28px', height: '28px', fontSize: '0.72rem', fontWeight: 800 }} onClick={() => insertTag('p')} title="Paragraph">
                  &lt;p&gt;
                </button>
              </div>

              <textarea 
                className="form-control" 
                rows={12}
                style={{ borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', lineHeight: '1.7' }}
                placeholder="Write your comprehensive report here. Paragraphs and formatting tags are automatically converted..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Row 5: Tags */}
            <div className="form-group">
              <label className="form-label">Tags / Topics (comma separated)</label>
              <input 
                type="text" 
                className="form-control"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Photonic Compute, Central Banks, Arctic Shipping"
              />
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onBackToWire}>
                Discard
              </button>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                <Send size={16} /> Broadcast Story to BullMonk
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Published Story Dossier */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', fontWeight: 800 }}>
              Your Published Dispatches
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage locally authored records and field stories
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
            {publishedArticles.length} STORIES TOTAL
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {publishedArticles.map((art) => (
            <div 
              key={art.id} 
              style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.2rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={art.heroImage} alt="Thumbnail" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                    {art.category} • {art.readTime}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', margin: '2px 0' }}>
                    {art.title}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    By {art.author.name} ({art.author.location})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => onSelectArticle(art)}
                >
                  <Eye size={13} /> View
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ color: 'var(--accent-red)', fontSize: '0.78rem' }}
                  onClick={() => {
                    if (confirm(`Retract "${art.title}" from BullMonk?`)) {
                      onDeleteArticle(art.id);
                    }
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
