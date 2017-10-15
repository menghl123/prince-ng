import {Injectable} from '@angular/core';

@Injectable()
export class DomHandler {

  public addMultipleClasses(element: any, className: any): void {
    if (element.classList) {
      className.split(' ').forEach(style => element.classList.add(style));
    } else {
      className.split(' ').forEach(style => {
        element.className += ' ' + style;
      });
    }
  }

  public findSingle(element: any, selector: string): any {
    return element.querySelector(selector);
  }

  public createElement(val: string) {
    return document.createElement(val);
  }

  public createTextNode(val: string) {
    return document.createTextNode(val);
  }
}
