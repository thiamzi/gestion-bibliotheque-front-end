import { AuthserviceService } from './../../Service/authservice.service';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  constructor( private auth: AuthserviceService) { }

  ngOnInit(): void {

  }

  deconnexion() {
    this.auth.decoonexion();
  }
}
