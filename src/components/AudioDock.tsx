import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { Play, Pause, X, Volume2, FastForward, ExternalLink } from 'lucide-react';
import { audioSpeechService } from '../utils/audioSpeechService';

interface AudioDockProps {
  article: Article | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onOpenArticle: (article: Article) => void;
}

export const AudioDock: React.FC<AudioDockProps> = ({
  article,
  isPlaying,
  onTogglePlay,
  onClose,
  onOpenArticle
}) => {
  const [seconds, setSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [totalSeconds, setTotalSeconds] = useState(240);

  useEffect(() => {
    if (!article) return;
    if (isPlaying) {
      audioSpeechService.playArticle(article, {
        onProgress: (sec, total) => {
          setSeconds(sec);
          setTotalSeconds(total);
        },
        onEnd: () => {
          onTogglePlay();
          setSeconds(0);
        }
      });
    } else {
      audioSpeechService.pause();
    }
  }, [isPlaying, article]);

  if (!article) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

  const cycleSpeed = () => {
    const nextRate: 1 | 1.25 | 1.5 = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    audioSpeechService.setSpeed(nextRate);
  };

  const handleClose = () => {
    audioSpeechService.stop();
    onClose();
  };

  return (
    <aside 
      className="audio-dock-container"
      aria-label="Audio Briefing Player"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(920px, calc(100% - 1.5rem))',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.22), 0 0 16px var(--accent-gold-glow)',
        zIndex: 90,
        padding: '0.75rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top track: story title, author, equalizer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
          {/* Animated sound wave bars */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            height: '24px',
            width: '24px',
            flexShrink: 0
          }}>
            {[40, 90, 60, 100, 70].map((h, i) => (
              <span
                key={i}
                style={{
                  width: '3px',
                  height: isPlaying ? `${h}%` : '20%',
                  background: 'var(--accent-gold)',
                  borderRadius: '2px',
                  transition: 'height 0.25s ease',
                  animation: isPlaying ? `audioWave 0.8s ease-in-out infinite alternate ${i * 0.15}s` : 'none'
                }}
              />
            ))}
          </div>

          {/* Title & Author */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>EXECUTIVE AUDIO WIRE</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>{article.region}</span>
            </div>
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {article.title}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <button
            onClick={cycleSpeed}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '3px 7px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Playback Speed"
            aria-label={`Playback speed ${playbackRate}x`}
          >
            {playbackRate}x
          </button>

          <button
            onClick={onTogglePlay}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px var(--accent-gold-glow)'
            }}
            title={isPlaying ? 'Pause Briefing' : 'Play Briefing'}
            aria-label={isPlaying ? 'Pause Briefing' : 'Play Briefing'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={() => onOpenArticle(article)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: 600
            }}
            className="hide-on-mobile"
            title="Read Full Dispatch"
            aria-label="Read Full Dispatch"
          >
            <ExternalLink size={14} /> Read
          </button>

          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close Audio Briefing"
            aria-label="Close Audio Briefing"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress scrubber bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
        <span>{formatTime(seconds)}</span>
        <div 
          style={{
            flex: 1,
            height: '4px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '2px',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            setSeconds(Math.floor(pct * totalSeconds));
          }}
        >
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'var(--accent-gold)',
            transition: 'width 0.2s linear'
          }} />
        </div>
        <span>{formatTime(totalSeconds)}</span>
      </div>
    </aside>
  );
};
