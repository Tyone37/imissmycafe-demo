import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe để bypass Angular's DomSanitizer cho URL của iframe Spotify/YouTube.
 * Chỉ dùng với URL biết chắc là an toàn (Spotify/YouTube embed).
 */
@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {

  private sanitizer = inject(DomSanitizer);

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
