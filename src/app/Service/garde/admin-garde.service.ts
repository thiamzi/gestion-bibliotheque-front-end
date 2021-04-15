import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService, Userdetails } from '../authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGardeService  implements CanActivate{

  user: Userdetails;

  constructor(
    private authservice: AuthserviceService,
    private router: Router,
  ) {this.user = this.authservice.getUserdetails()}


  canActivate() {
    if (this.authservice.Islogged() && this.user.isAdmin) {
      return true;
    } else {
      this.router.navigateByUrl("/accueil");
      return false;
    }
  }
}
