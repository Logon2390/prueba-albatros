import { Directive, ElementRef, inject, input, OnInit, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  // Permite desactivarla condicionalmente
  readonly appAutoFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  ngOnInit(): void {
    if (!this.appAutoFocus()) return;

    // Defer al siguiente frame para que el DOM esté listo
    requestAnimationFrame(() => {
      const target = this.getNativeInput();
      target?.focus();
    });
  }

  private getNativeInput(): HTMLElement | null {
    const host = this.el.nativeElement as HTMLElement;
    if (host.tagName === 'INPUT' || host.tagName === 'TEXTAREA') {
      return host;
    }
    return host.querySelector<HTMLElement>('input, textarea');
  }
}
