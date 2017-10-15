import {AfterViewInit, Directive, ElementRef, Input, NgModule, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/dom';
import {PrinceConfigService} from '../prince-config.service';

@Directive({
  selector: '[pButton]',
  providers: [DomHandler]
})
export class Button implements AfterViewInit, OnDestroy {
  @Input() iconPos: 'left' | 'right';
  @Input() cornerStyleClass: string;
  public _label: string;
  public _icon: string;
  public initialized: boolean;

  constructor(public el: ElementRef, public domHandler: DomHandler, private princeNGConfig: PrinceConfigService) {
    this.iconPos = <any>this.princeNGConfig.button.iconPos;
    this.cornerStyleClass = this.princeNGConfig.button.cornerStyleClass;
  }

  @Input()
  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
    if (this.initialized) {
      this.domHandler.findSingle(this.el.nativeElement, '.fa').className =
        `pr-button-icon-${this.iconPos} pr-clickable fa fa-fw ${this.icon}`;
    }
  }

  set label(val: string) {
    this._label = val;
    if (this.initialized) {
      this.domHandler.findSingle(this.el.nativeElement, '.pr-button-text').textContent = this._label;
    }
  }

  @Input()
  get label(): string {
    return this._label;
  }


  ngAfterViewInit(): void {
    this.domHandler.addMultipleClasses(this.el.nativeElement, this.getStyleClass());
    if (this.icon) {
      const iconElment = this.domHandler.createElement('span');
      iconElment.className =
        `pr-button-icon-${this.iconPos} pr-clickable fa fa-fw ${this.icon}`;
      this.el.nativeElement.appendChild(iconElment);
    }
    const labelElement = this.domHandler.createElement('span');
    labelElement.className = 'pr-button-text pr-clickable';
    labelElement.appendChild(this.domHandler.createTextNode(this.label || 'pr-btn'));
    this.el.nativeElement.appendChild(labelElement);
    this.initialized = true;
  }

  ngOnDestroy(): void {
    while (this.el.nativeElement.hasChildNodes()) {
      this.el.nativeElement.removeChild(this.el.nativeElement.lastChild);
    }
  }

  getStyleClass(): string {
    const styleClass = `pr-button pr-widget pr-state-default ${this.cornerStyleClass}`;
    let iconOrText = 'pr-button-text-only';
    if (this.icon) {
      iconOrText = this.label ? `pr-button-text-icon-${this.iconPos}` : 'pr-button-icon-only';
    }
    return `${styleClass} ${iconOrText}`;
  }

}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    Button
  ],
  declarations: [
    Button
  ]
})
export class ButtonModule {
}
