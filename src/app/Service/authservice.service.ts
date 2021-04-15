import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../modeles/user'
import { environment } from 'src/environments/environment';

export interface Userdetails {
  exp: number;
  iat: number;
  sub: string;
  isAdmin: boolean;
  isAgent:boolean;
  isBibliothecaire:boolean;
  isEtudiant:boolean;
}
export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  url = environment.url;
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }



  private saveToken(token: string): void {
    sessionStorage.setItem('usertoken', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('usertoken');
    }
    return this.token;
  }
  public getUserdetails(): Userdetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  public Islogged(): boolean {
    const user = this.getUserdetails();
    if (user) {
      user.exp > Date.now() / 1000;
      return true ;
    } else {
      return false;
    }
  }


  public connexion(user: any): Observable<any> {
    const base = this.http.post(`${this.url}login`, user);

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public decoonexion(): void {
    this.token = '';
    window.sessionStorage.removeItem('usertoken');
    this.router.navigateByUrl('/accueil');
  }

}

