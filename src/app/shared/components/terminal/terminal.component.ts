import { Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { PROFILE } from '../../../core/content/profile';

interface Line {
  kind: 'in' | 'out';
  text: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="requestClose.emit()"
        role="presentation"
      >
        <div
          class="flex h-[min(520px,85vh)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
        >
          <div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
            <span class="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/80"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="ml-2 text-xs text-zinc-400">m1dabo&#64;portfolio:~</span>
            <button
              type="button"
              class="ml-auto text-xs text-zinc-400 hover:text-zinc-200"
              (click)="requestClose.emit()"
            >
              exit
            </button>
          </div>
          <div #scrollBox class="flex-1 space-y-1 overflow-auto px-4 py-3 font-mono text-sm text-zinc-200">
            @for (line of lines(); track $index) {
              <div [class.text-teal-300]="line.kind === 'in'" [class.text-zinc-300]="line.kind === 'out'">
                @if (line.kind === 'in') {
                  <span class="text-teal-500">$ </span>
                }
                <span class="whitespace-pre-wrap">{{ line.text }}</span>
              </div>
            }
          </div>
          <form
            class="flex items-center gap-2 border-t border-zinc-800 px-4 py-3 font-mono text-sm"
            (submit)="submit($event)"
          >
            <span class="text-teal-500">$</span>
            <input
              #cmdInput
              class="flex-1 bg-transparent text-zinc-100 outline-none"
              [value]="command()"
              (input)="command.set($any($event.target).value)"
              name="command"
              autocomplete="off"
              spellcheck="false"
              aria-label="Terminal command"
            />
          </form>
        </div>
      </div>
    }
  `,
})
export class TerminalComponent {
  readonly open = input(false);
  readonly requestClose = output<void>();

  readonly lines = signal<Line[]>([
    { kind: 'out', text: 'Welcome to m1dabo shell. Type `help` to begin.' },
  ]);
  readonly command = signal('');

  private readonly scrollBox = viewChild<ElementRef<HTMLDivElement>>('scrollBox');
  private readonly cmdInput = viewChild<ElementRef<HTMLInputElement>>('cmdInput');

  constructor() {
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.cmdInput()?.nativeElement.focus());
      }
    });
  }

  submit(event: Event): void {
    event.preventDefault();
    const raw = this.command().trim();
    this.command.set('');
    if (!raw) {
      return;
    }
    this.lines.update((prev) => [...prev, { kind: 'in', text: raw }]);
    const out = this.handle(raw.toLowerCase());
    if (out === null) {
      this.requestClose.emit();
      return;
    }
    this.lines.update((prev) => [...prev, ...out.map((text) => ({ kind: 'out' as const, text }))]);
    queueMicrotask(() => {
      const el = this.scrollBox()?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  private handle(cmd: string): string[] | null {
    switch (cmd) {
      case 'help':
        return [
          'Available commands:',
          '  whoami      — identity',
          '  skills     — skill groups',
          '  experience — recent roles',
          '  hire       — contact info',
          '  clear      — clear screen',
          '  exit       — close terminal',
        ];
      case 'whoami':
        return [
          `${PROFILE.name} — ${PROFILE.title}`,
          PROFILE.headline,
          PROFILE.location,
          `ZATCA since Oct 2021 · ${PROFILE.links.site}`,
        ];
      case 'skills':
        return PROFILE.skills.map((g) => `${g.name}: ${g.skills.join(', ')}`);
      case 'experience':
        return PROFILE.experience.map(
          (e) => `${e.role} @ ${e.company} (${e.start} – ${e.end})`,
        );
      case 'hire':
        return [
          `Email: ${PROFILE.email}`,
          `Phone: ${PROFILE.phone}`,
          `LinkedIn: ${PROFILE.links.linkedin}`,
          `GitHub: ${PROFILE.links.github}`,
        ];
      case 'clear':
        this.lines.set([]);
        return [];
      case 'exit':
        return null;
      default:
        return [`command not found: ${cmd}. Try \`help\`.`];
    }
  }
}
