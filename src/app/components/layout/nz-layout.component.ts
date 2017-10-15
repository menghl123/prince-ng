import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'pr-layout',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `,
  styleUrls    : [
    './style/index.scss',
    './style/patch.scss'
  ]
})

export class NzLayoutComponent {
  @HostBinding('class.pr-layout-has-sider') hasSider = false;

  @HostBinding('class.pr-layout') _nzLayout = true;
}
