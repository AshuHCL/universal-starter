import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../common/modal/index';
import { Router } from '@angular/router';
import { UnlockService } from '../../common/services/unlock.service';
import { PreloaderService } from '../../common/services/preloader.service';

@Component({
  selector: 'wireless-number',
  templateUrl: 'wireless-number.component.html',
  styleUrls: ['wireless-number.component.scss']
})
export class WirelessNumberComponent implements OnInit {

  @Input()
  public cms;

  customerType: boolean = true;
  isInvalid: boolean = true;
  wirelessNumber: string = undefined;
  termsChecked: boolean = false;
  // wireLessErrorMsg: boolean = false;
  imeiNumber: string = undefined;

  attWrlsNoReqErr: boolean = false;
  attWrlsLengthWErr: boolean = false;
  attWrlsValidErr: boolean = false;
  attWrlsValidServerErr: boolean = false;

  nonAttImeiReqErr: boolean = false;

  deviceMake: string;
  deviceModel: string;
  showDeviceDetail: boolean = false;

  constructor( public modalService: ModalService, private unlockService: UnlockService,
    private route: Router, private preloader: PreloaderService) { }

  ngOnInit() {
    this.unlockService.redirectOCEWorkFlow()
    .subscribe((data: any) => {
      console.log(data);
      // return data;
    },
    (error) => {
      console.log(error);
    });
  }

  modalClosed(e) {

  }

  onCustomerTypeChange(value: boolean) {
    console.log(value);
    this.customerType = value;
  }

  validateNext(event) {

    if (this.customerType) {
      if (this.wirelessNumber.length == 0) {
        this.attWrlsNoReqErr = true;
      } else {
        this.attWrlsNoReqErr = false;
      }

      if (this.wirelessNumber != undefined && this.wirelessNumber.length == 10
        && this.termsChecked) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }
    } else {
      if (this.imeiNumber.length == 0) {
        this.nonAttImeiReqErr = true;
      } else {
        this.nonAttImeiReqErr = false;
      }

      if (this.imeiNumber != undefined && this.imeiNumber.length == 15
        && this.termsChecked) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }

      if (this.imeiNumber.length == 15) {
        this.preloader.start();
        this.unlockService.iemiOrderFlow(this.imeiNumber)
          .subscribe((data: any) => {
            console.log("validate iemi");
            console.log(data);
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
          });
      }
    }

  }

  termsChange() {
    this.termsChecked = !this.termsChecked;

    if (this.customerType) {
      if (this.wirelessNumber != undefined && this.wirelessNumber.length == 10
        && this.termsChecked) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }
    } else {
      if (this.imeiNumber != undefined && this.imeiNumber.length == 15
        && this.termsChecked) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }
    }

  }

  unlockNext() {
    // this.unlockService.orderFlow(this.wirelessNumber)
    //   .subscribe((data: any) => {
    //     console.log(data);
        
    //     this.route.navigate['/unlockstep2'];
    //   },
    //   (error) => {
    //     console.log(error);
    //   });
    this.route.navigate(['/unlockstep2', {wirelessNumber: this.wirelessNumber}]);
  }

  unlockPrevious() {
    // alert("navigate");
    this.route.navigate(['/unlock-canvas']);
  }

}