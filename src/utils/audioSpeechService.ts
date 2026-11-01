/**
 * BULLMONK Synthetic Voice Audio Dispatch Service
 * Uses native Web Speech API (speechSynthesis) to deliver authentic spoken audio
 * for all investigative journalism dispatches with Chrome keep-alive and sentence chunking.
 */

import { Article } from '../types';

export interface SpeechCallbacks {
  onStart?: () => void;
  onProgress?: (elapsedSec: number, totalSec: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
}

class AudioSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private chunks: string[] = [];
  private currentChunkIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private keepAliveTimer: any = null;
  private progressTimer: any = null;
  private elapsedSeconds: number = 0;
  private estimatedTotalSeconds: number = 240;
  private rate: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private callbacks: SpeechCallbacks = {};
  private activeArticleId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer high-quality English natural voices (e.g., Microsoft Natural, Google US/UK, Apple Daniel/Samantha)
    const priorityVoices = [
      'Microsoft Ryan Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Andrew Online (Natural)',
      'Google US English',
      'Google UK English Male',
      'Google UK English Female',
      'Daniel',
      'Alex',
      'Samantha',
      'Microsoft David Desktop',
      'Microsoft Mark Desktop'
    ];

    for (const name of priorityVoices) {
      const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (match) {
        this.selectedVoice = match;
        return;
      }
    }

    // Fallback: First English voice
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      this.selectedVoice = enVoice;
    }
  }

  /**
   * Convert article HTML content into clean, spoken prose sentences
   */
  private extractSpokenText(article: Article): string[] {
    const parts: string[] = [];

    // 1. Intro announcement
    parts.push(`BullMonk International Intelligence Audio Briefing.`);
    parts.push(`${article.title}.`);
    if (article.deck) {
      parts.push(`${article.deck}.`);
    }
    parts.push(`Reported by ${article.author.name} from the ${article.author.location}.`);

    // 2. Executive Key Takeaways if available
    if (article.keyTakeaways && article.keyTakeaways.length > 0) {
      parts.push(`Key investigative takeaways.`);
      article.keyTakeaways.forEach((takeaway, idx) => {
        parts.push(`Point ${idx + 1}: ${takeaway}`);
      });
      parts.push(`Primary dispatch report.`);
    }

    // 3. Clean body content (strip HTML tags, remove data tables to avoid reading raw cells)
    let bodyText = article.content || '';
    // Remove tables, code blocks, and source ledger cards from spoken text
    bodyText = bodyText.replace(/<table[\s\S]*?<\/table>/gi, ' Detailed comparative statistical tables are available in the written dispatch. ');
    bodyText = bodyText.replace(/<div class="investigative-sources-card"[\s\S]*?<\/div>/gi, '');
    bodyText = bodyText.replace(/<div class="bluf-triage-card"[\s\S]*?<\/div>/gi, '');
    bodyText = bodyText.replace(/<[^>]+>/g, ' ');
    bodyText = bodyText.replace(/&nbsp;/g, ' ');
    bodyText = bodyText.replace(/&pound;/g, 'pounds ');
    bodyText = bodyText.replace(/&euro;/g, 'euros ');
    bodyText = bodyText.replace(/&amp;/g, 'and ');
    bodyText = bodyText.replace(/\s+/g, ' ').trim();

    // Split body into manageable sentence chunks (~140-180 chars) for stable speech synthesis
    const rawSentences = bodyText.match(/[^.!?]+[.!?]+(\s|$)/g) || [bodyText];
    for (const s of rawSentences) {
      const trimmed = s.trim();
      if (trimmed.length > 10) {
        parts.push(trimmed);
      }
    }

    return parts;
  }

  public playArticle(article: Article, callbacks: SpeechCallbacks = {}): boolean {
    if (!this.synth) {
      callbacks.onError?.('Web Speech API is not supported in this browser.');
      return false;
    }

    // If already playing this article and paused, resume
    if (this.activeArticleId === article.id && this.isPaused) {
      this.resume();
      return true;
    }

    // Stop any existing playback
    this.stop();

    this.activeArticleId = article.id;
    this.callbacks = callbacks;
    this.chunks = this.extractSpokenText(article);
    this.currentChunkIndex = 0;
    this.elapsedSeconds = 0;
    
    // Estimate total seconds based on average speaking rate of 140 words/min
    const totalWords = this.chunks.join(' ').split(/\s+/).length;
    this.estimatedTotalSeconds = Math.max(90, Math.round((totalWords / 140) * 60));

    this.isPlaying = true;
    this.isPaused = false;

    this.callbacks.onStart?.();
    this.startProgressTimer();
    this.startKeepAlive();
    this.speakCurrentChunk();

    return true;
  }

  private speakCurrentChunk() {
    if (!this.synth || !this.isPlaying || this.isPaused) return;

    if (this.currentChunkIndex >= this.chunks.length) {
      this.finishPlayback();
      return;
    }

    const text = this.chunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentChunkIndex++;
        this.speakCurrentChunk();
      }
    };

    utterance.onerror = (e) => {
      // If cancelled intentionally, ignore
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('Speech synthesis error on chunk:', e);
      // Skip to next chunk to prevent complete halt
      this.currentChunkIndex++;
      this.speakCurrentChunk();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (!this.synth || !this.isPlaying) return;
    this.isPaused = true;
    this.synth.pause();
    this.stopProgressTimer();
    this.stopKeepAlive();
    this.callbacks.onPause?.();
  }

  public resume() {
    if (!this.synth || !this.isPlaying) return;
    this.isPaused = false;
    this.synth.resume();
    this.startProgressTimer();
    this.startKeepAlive();
    this.callbacks.onResume?.();

    // Sometimes Chrome gets stuck on resume; if speaking is false, re-speak chunk
    if (!this.synth.speaking) {
      this.speakCurrentChunk();
    }
  }

  public toggle(article: Article, callbacks: SpeechCallbacks = {}): boolean {
    if (this.isPlaying && this.activeArticleId === article.id) {
      if (this.isPaused) {
        this.resume();
        return true;
      } else {
        this.pause();
        return false;
      }
    } else {
      return this.playArticle(article, callbacks);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.stopProgressTimer();
    this.stopKeepAlive();

    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.currentChunkIndex = 0;
    this.elapsedSeconds = 0;
  }

  public setSpeed(newRate: number) {
    this.rate = Math.max(0.75, Math.min(2.0, newRate));
    if (this.isPlaying && !this.isPaused && this.synth) {
      // Cancel and re-speak current chunk with new rate
      this.synth.cancel();
      this.speakCurrentChunk();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  public getIsActive(): boolean {
    return this.isPlaying;
  }

  public getActiveArticleId(): string | null {
    return this.activeArticleId;
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  public getEstimatedTotalSeconds(): number {
    return this.estimatedTotalSeconds;
  }

  private startProgressTimer() {
    this.stopProgressTimer();
    this.progressTimer = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        this.elapsedSeconds++;
        this.callbacks.onProgress?.(this.elapsedSeconds, this.estimatedTotalSeconds);
        if (this.elapsedSeconds >= this.estimatedTotalSeconds && this.currentChunkIndex >= this.chunks.length) {
          this.finishPlayback();
        }
      }
    }, 1000);
  }

  private stopProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  /**
   * Chromium has a known bug where SpeechSynthesis halts silently after 15 seconds.
   * Periodically calling pause/resume keeps the audio thread alive.
   */
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.isPlaying && !this.isPaused && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 12000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private finishPlayback() {
    this.stop();
    this.callbacks.onEnd?.();
  }
}

export const audioSpeechService = new AudioSpeechService();
