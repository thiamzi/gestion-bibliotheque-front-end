import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService} from '../authservice.service';

@Injectable({
  providedIn: 'root'
})
export class GardeService implements CanActivate{

  constructor(
    private authservice: AuthserviceService,
    private router: Router,
  ) {}
  canActivate() {
    if (!this.authservice.Islogged()) {
      this.router.navigateByUrl("/accueil");
      console.log("non connecter")
      return false;
    } else {
      return true;
    }
  }


}
