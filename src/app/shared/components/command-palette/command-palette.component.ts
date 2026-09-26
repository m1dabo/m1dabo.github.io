import { Component, ElementRef, HostListener, inject, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

export interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
        (click)="close()"
        role="presentation"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div class="border-b border-[var(--border)] px-3 py-2">
            <input
              #queryInput
              type="text"
              class="w-full bg-transparent px-2 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
              placeholder="Jump to section, toggle theme, open terminal…"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
              (keydown)="onKey($event)"
            />
          </div>
          <ul class="max-h-72 overflow-auto py-1" role="listbox">
            @for (action of filtered(); track action.id; let i = $index) {
              <li>
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                  [class.bg-[var(--accent-soft)]]="i === active()"
                  [class.text-[var(--accent)]]="i === active()"
                  (mouseenter)="active.set(i)"
                  (click)="run(action)"
                >
                  <span>{{ action.label }}</span>
                  @if (action.hint) {
                    <span class="text-xs text-[var(--fg-muted)]">{{ action.hint }}</span>
                  }
                </button>
              </li>
            } @empty {
              <li class="px-4 py-6 text-center text-sm text-[var(--fg-muted)]">No matches</li>
            }
          </ul>
          <div class="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--fg-muted)]">
            ↑↓ navigate · Enter select · Esc close
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent {
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('queryInput');

  readonly openTerminal = output<void>();
  readonly open = signal(false);
  readonly query = signal('');
  readonly active = signal(0);

  private readonly actions: PaletteAction[] = [
    { id: 'hero', label: 'Go to Hero', hint: 'Home', run: () => this.scroll('hero') },
    { id: 'about', label: 'Go to About', run: () => this.scroll('about') },
    { id: 'impact', label: 'Go to Impact', run: () => this.scroll('impact') },
    { id: 'case-studies', label: 'Go to Selected Work', run: () => this.scroll('case-studies') },
    { id: 'experience', label: 'Go to Experience', run: () => this.scroll('experience') },
    { id: 'skills', label: 'Go to Skills', run: () => this.scroll('skills') },
    { id: 'open-source', label: 'Go to Open Source', run: () => this.scroll('open-source') },
    { id: 'education', label: 'Go to Education', run: () => this.scroll('education') },
    { id: 'contact', label: 'Go to Contact', run: () => this.scroll('contact') },
    { id: 'theme', label: 'Toggle theme', hint: 'Light / Dark', run: () => this.theme.toggleLightDark() },
    { id: 'terminal', label: 'Open terminal', hint: 'Easter egg', run: () => this.openTerminal.emit() },
    {
      id: 'privacy',
      label: 'Privacy',
      run: () => {
        void this.router.navigateByUrl('/privacy');
      },
    },
  ];

  filtered(): PaletteAction[] {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.actions;
    }
    return this.actions.filter((a) => a.label.toLowerCase().includes(q) || a.id.includes(q));
  }

  show(): void {
    this.open.set(true);
    this.query.set('');
    this.active.set(0);
    queueMicrotask(() => this.inputRef()?.nativeElement.focus());
  }

  close(): void {
    this.open.set(false);
  }

  toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.show();
    }
  }

  run(action: PaletteAction): void {
    action.run();
    this.close();
  }

  onKey(event: KeyboardEvent): void {
    const items = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.set((this.active() + 1) % Math.max(items.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set((this.active() - 1 + items.length) % Math.max(items.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const action = items[this.active()];
      if (action) {
        this.run(action);
      }
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.toggle();
    }
  }

  private scroll(id: string): void {
    if (this.router.url !== '/') {
      void this.router.navigateByUrl('/').then(() => {
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
