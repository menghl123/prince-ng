import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'pr-footer',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})

export class NzFooterComponent {
  @HostBinding('class.pr-layout-footer') _nzLayoutFooter = true;
}
