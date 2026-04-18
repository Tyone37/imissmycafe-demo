import { Injectable, OnDestroy } from '@angular/core';
import { SOUND_LIST, SoundMeta } from '../config/sounds.config';

@Injectable({ providedIn: 'root' })
export class AudioService implements OnDestroy {

  private ctx: AudioContext | null = null;
  private nodes = new Map<string, {
    source?: AudioBufferSourceNode;
    gain: GainNode;
    panner: StereoPannerNode;
    buffer: AudioBuffer;
  }>();

  readonly SOUNDS: SoundMeta[] = SOUND_LIST;

  /**
   * AudioContext created lazily on first user interaction to comply with
   * browser autoplay policy (Chrome blocks AudioContext before a gesture).
   */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  async loadSound(soundId: string, filePath: string): Promise<void> {
    const ctx = this.ensureContext();
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    gain.connect(panner);
    panner.connect(ctx.destination);

    this.nodes.set(soundId, { gain, panner, buffer: audioBuffer });
  }

  play(soundId: string): void {
    const ctx = this.ensureContext();
    const node = this.nodes.get(soundId);
    if (!node) return;

    const source = ctx.createBufferSource();
    source.buffer = node.buffer;
    source.loop = true;
    source.connect(node.gain);
    source.start();

    this.nodes.set(soundId, { ...node, source });
  }

  stop(soundId: string): void {
    const node = this.nodes.get(soundId);
    if (!node?.source) return;
    try {
      node.source.stop();
    } catch {
      // already stopped
    }
    this.nodes.set(soundId, { ...node, source: undefined });
  }

  setVolume(soundId: string, volume: number): void {
    const node = this.nodes.get(soundId);
    if (node) node.gain.gain.value = Math.max(0, Math.min(1, volume));
  }

  setPan(soundId: string, pan: number): void {
    const node = this.nodes.get(soundId);
    if (node) node.panner.pan.value = Math.max(-1, Math.min(1, pan));
  }

  ngOnDestroy(): void {
    this.nodes.forEach((_, id) => this.stop(id));
    this.ctx?.close();
    this.nodes.clear();
  }
}
