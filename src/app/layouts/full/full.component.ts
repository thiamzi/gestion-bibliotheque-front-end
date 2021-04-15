import { Userdetails } from './../../Service/authservice.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthserviceService } from 'src/app/Service/authservice.service';
declare var $: any;

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

	public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router , private auth : AuthserviceService) {}

  public innerWidth: any;
  public defaultSidebar: any;
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = 'full';
  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
  }

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/starter']);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
    this.user = this.auth.getUserdetails()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = 'mini-sidebar';
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case 'full':
        this.sidebartype = 'mini-sidebar';
        break;

      case 'mini-sidebar':
        this.sidebartype = 'full';
        break;

      default:
    }
  }

  islogged() {
    if (this.auth.Islogged() == true) {
      return true;
    }
    return false;
  }

}
