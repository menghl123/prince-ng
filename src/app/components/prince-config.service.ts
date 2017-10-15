import {Injectable} from '@angular/core';

@Injectable()
export class PrinceConfigService {
  button = {
    iconPos: 'left',
    cornerStyleClass: 'pr-corner-all'
  };

  tabView = {
    orientation: 'top',
    cache: true
  };
}
