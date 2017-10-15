import {
  AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, EmbeddedViewRef, EventEmitter, Input,
  NgModule, OnDestroy,
  Output,
  QueryList,
  TemplateRef, ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlockableUI} from '../common/blockableui';
import {PrinceConfigService} from '../prince-config.service';
import {PrimeTemplate, SharedModule} from '../common/shared';

@Component({
  selector: '[pr-tabViewNav]',
  host: {
    '[class.pr-tabview-nav]': 'true',
    '[class.pr-helper-reset]': 'true',
    '[class.pr-helper-clearfix]': 'true',
    '[class.pr-widget-header]': 'true',
    '[class.pr-corner-all]': 'true',
  },
  template: `
    <ng-template ngFor let-tab [ngForOf]="tabs">
      <li [class]="getDefaultHeaderClass(tab)" [ngStyle]="tab.headerStyle" role="tab"
          [ngClass]="{'pr-tabview-selected pr-state-active':tab.selected,'pr-state-disabled':tab.disabled}"
          (click)="clickTab($event,tab)" *ngIf="!tab.closed"
          [attr.aria-expanded]="tab.selected" [attr.aria-selected]="tab.selected">
        <a href="#">
          <span class="pr-tabview-left-icon fa" [ngClass]="tab.leftIcon" *ngIf="tab.leftIcon"></span>
          <span class="pr-tabview-title">{{tab.header}}</span>
          <span class="pr-tabview-right-icon fa" [ngClass]="tab.rightIcon" *ngIf="tab.rightIcon"></span>
        </a>
        <span *ngIf="tab.closable" class="pr-tabview-close fa fa-close" (click)="clickClose($event,tab)"></span>
      </li>
    </ng-template>
  `
})
export class TabViewNav {
  @Input() tabs: TabPanel[];
  @Input() orientation: 'top' | 'bottom' | 'left' | 'right';
  @Output() onTabClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTableCloseClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private princeNGConfig: PrinceConfigService) {
    this.orientation = <any>this.princeNGConfig.tabView.orientation;

  }

  getDefaultHeaderClass(tab: TabPanel): string {
    const headerStyle = tab.headerStyleClass ? ` ${tab.headerStyleClass}` : '';
    return `pr-state-default pr-corner-${this.orientation}${headerStyle}`;
  }

  clickTab(event: any, tab: TabPanel) {
    this.onTabClick.emit({
      originalEvent: event,
      tab: tab
    });
  }

  clickClose(event: any, tab: TabPanel) {
    this.onTableCloseClick.emit({
      originalEvent: event,
      tab: tab
    });
  }
}

@Component({
  selector: 'pr-tabPanel',
  template: `
    <div class="pr-tabview-panel pr-widget-content" [ngStyle]="{'display':selected?'block' : 'none'}"
         role="tabpanel"
         [attr.arial-hidden]="!selected" *ngIf="!closed">
      <ng-content></ng-content>
      <p-templateLoader [template]="contentTemplate"
                        *ngIf="contentTemplate && (cache ? loaded : selected)"></p-templateLoader>
    </div>
  `
})
export class TabPanel implements AfterContentInit, OnDestroy {
  @Input() header: string;
  @Input() disabled: string;
  @Input() closable: boolean;
  @Input() headerStyle: string;
  @Input() headerStyleClass: string;
  @Input() leftIcon: string;
  @Input() rightIcon: string;
  @Input() cache: boolean;
  @ContentChildren(PrimeTemplate) templates: QueryList<any>;
  public contentTemplate: TemplateRef<any>;
  closed: boolean;
  view: EmbeddedViewRef<any>;
  _selected: boolean;
  loaded: boolean;

  @Input()
  get selected(): boolean {
    return this._selected;
  }

  set selected(val: boolean) {
    this._selected = val;
    this.loaded = true;
  }


  constructor(public viewContainer: ViewContainerRef, private princeNGConfig: PrinceConfigService) {
    this.cache = this.princeNGConfig.tabView.cache;
  }


  ngAfterContentInit(): void {
    this.templates.toArray().forEach((item) => {
      this.contentTemplate = item.template
    });
  }

  ngOnDestroy(): void {
    this.view = null;
  }

}

@Component({
  selector: 'pr-tabView',
  template: `
    <div [ngClass]="'pr-tabview pr-widget pr-widget-content pr-corner-all pr-tabview-' + orientation" [ngStyle]="style"
         [class]="styleClass">
      <ul pr-tabViewNav role="tablist" *ngIf="orientation!=='bottom'" [tabs]="tabs" [orientation]="orientation"
          (onTabClick)="openTab($event.originalEvent, $event.tab)"
          (onTabCloseClick)="close($event.originalEvent, $event.tab)"></ul>
      <div class="pr-tabview-panels">
        <ng-content></ng-content>
      </div>
      <ul pr-tabViewNav role="tablist" *ngIf="orientation==='bottom'" [tabs]="tabs" [orientation]="orientation"
          (onTabClick)="openTab($event.originalEvent, $event.tab)"
          (onTabCloseClick)="close($event.originalEvent, $event.tab)"></ul>
    </div>
  `,
})
export class TabView implements AfterContentInit, BlockableUI {
  @Input() orientation: 'top' | 'bottom' | 'right' | 'left';
  @Input() style: any;
  @Input() styleClass: string;
  @Input() controlClose: boolean;
  @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  initialzed: boolean;
  tabs: TabPanel[];
  _activeIndex: number;
  @Input()
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(val: number) {
    this._activeIndex = val;

    if (this.tabs && this.tabs.length && this._activeIndex !== null && this.tabs.length > this._activeIndex) {
      this.findSelectedTab().selected = false;
      this.tabs[this._activeIndex].selected = true;
    }
  }

  constructor(private el: ElementRef, private princeNGConfig: PrinceConfigService) {
    this.orientation = <any>this.princeNGConfig.tabView.orientation;
  }

  ngAfterContentInit(): void {
    this.initTabs();
    this.tabPanels.changes.subscribe(() => this.initTabs());
  }

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }

  initTabs() {
    this.tabs = this.tabPanels.toArray();
    const selectedTab = this.findSelectedTab();
    if (!selectedTab && this.tabs.length && this.tabs.length > 0) {
      const index = (this.activeIndex && this.tabs.length > this.activeIndex) ? this.activeIndex : 0;
      this.tabs[index].selected = true;
    }
  }

  openTab(event: any, tab: TabPanel) {
    if (tab.disabled) {
      if (event) {
        event.preventDefault();
      }
      return;
    }
    if (!tab.selected) {
      const selectedTab: TabPanel = this.findSelectedTab();
      if (selectedTab) {
        selectedTab.selected = false;
      }
      tab.selected = true;
      this.onChange.emit({originalEvent: event, index: this.findTabIndex(tab)});
    }
    if (event) {
      event.preventDefault();
    }
  }

  close(event: any, tab: TabPanel) {
    if (this.controlClose) {
      this.onClose.emit({
        originalEvent: event,
        index: this.findTabIndex(tab),
        close: () => {
          this.closeTab(tab);
        }
      });
    } else {
      this.closeTab(tab);
      this.onClose.emit({
        originalEvent: event,
        index: this.findTabIndex(tab)
      });
    }
    event.stopPropagation();
  }

  closeTab(tab: TabPanel) {
    tab.closed = true;
    if (tab.selected) {
      tab.selected = false;
      this.tabs.forEach((_tab) => {
        if (!_tab.closed && !_tab.disabled) {
          _tab.selected = true;
          return;
        }
      });
    }
  }

  findTabIndex(tab: TabPanel) {
    return this.tabs.indexOf(tab);
  }

  findSelectedTab() {
    let resultTab = null;
    this.tabs.forEach((tab) => {
      if (tab.selected) {
        resultTab = tab;
      }
    });
    return resultTab;
  }
}

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [TabView, TabPanel, TabViewNav, SharedModule],
  declarations: [TabView, TabPanel, TabViewNav]
})
export class TabViewModule {
}
