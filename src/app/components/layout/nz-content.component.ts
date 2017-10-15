import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'pr-content',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})

export class NzContentComponent {
  @HostBinding('class.pr-layout-content') _nzLayoutContent = true;
}
