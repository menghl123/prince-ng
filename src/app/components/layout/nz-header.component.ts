import { Component, HostBinding } from '@angular/core';

@Component({
  selector     : 'pr-header',
  template     : `
    <ng-content></ng-content>
  `
})

export class NzHeaderComponent {
  @HostBinding('class.pr-layout-header') _nzLayoutHeader = true;
}
