import { Component } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { AppStore } from '../models/appstore.model';
import { UnlockData, ActionCart } from '../models/unlock.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  public cms: Observable<UnlockData>;

  constructor(private store: Store<AppStore>) {
    this.cms = store.select('cms');
  }

  public changeLanguage() {
    localStorage.unlockapplang =
      localStorage.unlockapplang === 'es' ? 'en' : 'es';
    location.reload(true);
  }
}
