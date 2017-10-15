import {
  Component,
  HostBinding,
  HostListener,
  Optional,
  Host,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import { NzLayoutComponent } from './nz-layout.component';

export type NzBreakPoinit = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector     : 'pr-sider',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
    <span class="pr-layout-sider-zero-width-trigger" *ngIf="_isZeroTrigger" (click)="toggleCollapse()">
      <i class="fa fa-bars"></i>
    </span>
    <div class="pr-layout-sider-trigger" *ngIf="_isSiderTrgger" (click)="toggleCollapse()">
      <i class="fa" [class.fa-angel-left]="!nzCollapsed" [class.fa-angel-right]="nzCollapsed"></i>
    </div>
  `
})

export class NzSiderComponent {
  _dimensionMap = {
    xl: '1600px',
    lg: '1200px',
    md: '992px',
    sm: '768px',
    xs: '480px',
  };
  _below = false;
  @Input() nzWidth = '200';
  @Input() nzTrigger = true;
  @Input() nzCollapsedWidth = 64;
  @Input() nzBreakpoint: NzBreakPoinit;
  @Input() @HostBinding('class.pr-layout-sider-collapsed') nzCollapsed = false;
  _collapsible = false;

  @Input()
  set nzCollapsible(value: boolean | string) {
    if (value === '') {
      this._collapsible = true;
    } else {
      this._collapsible = value as boolean;
    }
  }

  get nzCollapsible() {
    return this._collapsible;
  }

  @Output() nzCollapsedChange = new EventEmitter();
  @HostBinding('class.pr-layout-sider') _nzLayoutSider = true;

  @HostBinding('class.pr-layout-sider-zero-width')
  get setZeroClass() {
    return this.nzCollapsed && (this.nzCollapsedWidth === 0);
  }

  @HostBinding('style.flex')
  get setFlex() {
    if (this.nzCollapsed) {
      return `0 0 ${this.nzCollapsedWidth}px`;
    } else {
      return `0 0 ${this.nzWidth}px`;
    }
  }

  @HostBinding('style.width.px')
  get setWidth() {
    if (this.nzCollapsed) {
      return this.nzCollapsedWidth;
    } else {
      return this.nzWidth;
    }
  }

  @HostListener('window:resize', [ '$event' ])
  onWindowResize(e) {
    if (this.nzBreakpoint) {
      const matchBelow = window.matchMedia(`(max-width: ${this._dimensionMap[ this.nzBreakpoint ]})`).matches;
      this._below = matchBelow;
      this.nzCollapsed = matchBelow;
      this.nzCollapsedChange.emit(matchBelow);
    }
  }

  toggleCollapse() {
    this.nzCollapsed = !this.nzCollapsed;
    this.nzCollapsedChange.emit(this.nzCollapsed);
  }


  constructor(@Optional() @Host() private nzLayoutComponent: NzLayoutComponent) {
    if (this.nzLayoutComponent) {
      this.nzLayoutComponent.hasSider = true;
    }
    if (typeof window !== 'undefined') {
      const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
        return {
          media: mediaQuery,
          matches: false,
          addListener() {
          },
          removeListener() {
          },
        };
      };
      window.matchMedia = window.matchMedia || matchMediaPolyfill;
    }
  }

  get _isZeroTrigger() {
    return this.nzCollapsible && this.nzTrigger && (this.nzCollapsedWidth === 0) && ((this.nzBreakpoint && this._below) || (!this.nzBreakpoint));
  }

  get _isSiderTrgger() {
    return this.nzCollapsible && this.nzTrigger && (this.nzCollapsedWidth !== 0);
  }
}
