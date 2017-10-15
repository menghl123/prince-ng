import {
  Component, Directive, EmbeddedViewRef, Input, NgModule, OnDestroy, OnInit, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';

@Directive({
  selector: '[pr-template]',
})
export class PrimeTemplate {
  @Input() type: string;

  @Input('pTemplate') name: string;

  constructor(public template: TemplateRef<any>) {
  }

  getType(): string {
    return this.name;
  }
}

@Component({
  selector: 'p-templateLoader',
  template: ``
})
export class TemplateLoader implements OnInit, OnDestroy {

  @Input() template: TemplateRef<any>;

  @Input() data: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.template) {
      this.view = this.viewContainer.createEmbeddedView(this.template, {
        '\$implicit': this.data
      });
    }
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [PrimeTemplate, TemplateLoader],
  declarations: [PrimeTemplate, TemplateLoader]
})
export class SharedModule {
}
