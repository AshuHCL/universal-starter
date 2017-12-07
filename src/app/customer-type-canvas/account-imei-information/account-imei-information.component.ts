import { UnlockService } from '../../common/services/unlock.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalService } from '../../common/modal/index';
import { ActivatedRoute, Router } from '@angular/router';
import { PreloaderService } from '../../common/services/preloader.service';
import { AppState } from '../../common/services/app.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'account-imei-information',
  templateUrl: 'account-imei-information.component.html',
  styleUrls: ['account-imei-information.component.scss']
})
export class AccountIEMIInformationComponent implements OnDestroy {
  // @Input()
  public cms;
  public imeiNumber = undefined;
  public showDeviceDetail: boolean = false;
  public isInvalid: boolean = true;
  public nonAttImeiReqErr: boolean = false;
  public deviceMake = undefined;
  public deviceModel = undefined;
  private subscription: ISubscription;
  constructor(
    public modalService: ModalService,
    private unlockService: UnlockService,
    private appState: AppState,
    private route: Router,
    private preloader: PreloaderService
  ) {
    this.cms = this.appState.get('unlockDevice');
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public unlockNext() {
    // this.unlockService.orderFlow(this.wirelessNumber)
    //   .subscribe((data: any) => {
    //     console.log(data);

    //     this.route.navigate['/unlockstep2'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   });

    this.route.navigate(['/unlockConfirm/', { customerType: true }]);
  }

  public unlockPrevious() {
    this.route.navigate(['/unlockstep2']);
  }

  public validateNext(event) {
    if (this.imeiNumber !== undefined) {
      if (this.imeiNumber.length === 0) {
        this.nonAttImeiReqErr = true;
      } else {
        this.nonAttImeiReqErr = false;
      }

      if (this.imeiNumber.length < 15) {
        this.isInvalid = true;
      }

      if (this.imeiNumber.length === 15) {
        this.isInvalid = false;
        this.preloader.start();
        this.unlockService.imeiMakeModelResponse(this.imeiNumber).subscribe(
          (data: any) => {
            // return data;
            // this.route.navigate['/unlock-canvas'];
            this.preloader.stop();
            this.showDeviceDetail = true;
            this.deviceMake = data.orderFlowResponseDO.make;
            this.deviceModel = data.orderFlowResponseDO.model;
          },
          (error) => {
            console.log(error);
            this.preloader.stop();
          }
        );
      }
    }
  }
}
