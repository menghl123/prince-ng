import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from './button/button';
import {PrinceConfigService} from './prince-config.service';
import {TabViewModule} from './tabview/tabview';
import {NzLayoutModule} from './layout/nz-layout.module';


@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TabViewModule,
    NzLayoutModule
  ],
  exports: [
    ButtonModule,
    TabViewModule,
    NzLayoutModule
  ],
  declarations: [
  ]
})
export class PrinceModule {
  static forRoot(): ModuleWithProviders {

    return {
      ngModule: PrinceModule,
      providers: [
        {provide: PrinceConfigService, useClass: PrinceConfigService},
      ]
    };
  }
}

