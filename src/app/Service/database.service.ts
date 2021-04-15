import { Bibliothecaire } from './../modeles/bibliothecaire';
import { Agent } from './../modeles/agent';
import { Livre } from './../modeles/livre';
import { Categorie } from './../modeles/categorie';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../modeles/user';
import { Image } from '../modeles/image';
import { Etudiant } from '../modeles/etudiant';
import { Emprunt } from '../modeles/emprunt';
import { ModalService } from './modal.service';
import { Reservation } from '../modeles/reservation';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  url = environment.url;


  constructor(private http: HttpClient, private modal: ModalService) { }

  public getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.url}allcategories`);
  }

  public addCategorie(categorie): Observable<any> {
    return this.http.post(`${this.url}addcategorie`, categorie);
  }

  public editCategorie(categorie): Observable<any> {
    return this.http.put(`${this.url}updatecategorie`, categorie);
  }

  public oneCategorie(id): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.url}onecategorie/${id}`);
  }
  public deletCategorie(id) {
    return this.http.delete(`${this.url}deletecategorie/${id}`);
  }

  //-------------------------------------------------------------------------------

  public getAllLivres(): Observable<Livre[]> {
    return this.http.get<Livre[]>(`${this.url}alllivres`);
  }

  public addLivre(livre): Observable<any> {
    return this.http.post(`${this.url}addlivre`, livre);
  }

  public editLivre(livre): Observable<any> {
    return this.http.put(`${this.url}updatelivre`, livre);
  }

  public oneLivre(id): Observable<Livre> {
    return this.http.get<Livre>(`${this.url}onelivre/${id}`);
  }
  public deletlivre(id) {
    return this.http.delete(`${this.url}deletelivre/${id}`);
  }

  //-----------------------------------------------------------------------

  public getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.url}allagents`);
  }

  public addAgent(agent): Observable<any> {
    return this.http.post(`${this.url}addagent`, agent);
  }

  public editAgent(agent): Observable<any> {
    return this.http.put(`${this.url}updateagent`, agent);
  }

  public oneAgent(id): Observable<Agent> {
    return this.http.get<Agent>(`${this.url}oneagent/${id}`);
  }
  public deleteAgent(id) {
    return this.http.delete(`${this.url}deleteagent/${id}`);
  }

  //--------------------------------------------------------------------------

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}allusers`);
  }

  public addUser(user): Observable<any> {
    return this.http.post(`${this.url}register`, user);
  }

  public editUser(user): Observable<any> {
    return this.http.put(`${this.url}updateuser`, user);
  }
  public UpdatePassword(user): Observable<any> {
    return this.http.put(`${this.url}updatepassword`, user);
  }

  public oneUser(email): Observable<User> {
    return this.http.get<User>(`${this.url}oneuser/${email}`);
  }
  public deleteUser(id) {
    return this.http.delete(`${this.url}deleteuser/${id}`);
  }

  //-------------------------------------------------------------------

  public addImage(image): Observable<any> {
    return this.http.post(`${this.url}addimage`, image);
  }

  public editImage(image): Observable<any> {
    return this.http.put(`${this.url}updateimage`, image);
  }

  public oneImage(id): Observable<Image> {
    return this.http.get<Image>(`${this.url}oneimage/${id}`);
  }
  public deleteImage(id: any) {
    return this.http.delete(`${this.url}deleteimage/${id}`);
  }

  //-----------------------------------------------------------------------

  public getAllEtudiantsTrue(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.url}alletudiantstrue`);
  }

  public getAllEtudiantsFalse(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.url}alletudiantsfalse`);
  }
  public getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.url}alletudiants`);
  }
  public addEtudiant(etudiant): Observable<any> {
    return this.http.post(`${this.url}addetudiant`, etudiant);
  }

  public editEtudiant(etudiant): Observable<any> {
    return this.http.put(`${this.url}updateetudiant`, etudiant);
  }

  public oneEtudiant(id): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.url}oneetudiant/${id}`);
  }
  public deleteEtudiant(id) {
    return this.http.delete(`${this.url}deleteetudiant/${id}`);
  }

  public validerEtudiant(etudiant): Observable<any> {
    return this.http.put(`${this.url}validateetudiant`, etudiant);
  }
  //-----------------------------------------------------------------------

  public getAllEmpruntsEncours(): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.url}allempruntsencours` );
  }

  public getAllEmpruntsEnRetard(): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.url}allempruntsenretard` );
  }

  public getAllEmpruntsregles(): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.url}allempruntsregles`);
  }

  public getAllEmpruntsNouveaux(): Observable<Emprunt[]> {
    return this.http.get<Emprunt[]>(`${this.url}allempruntsnouveaux` );
  }

  public addEmprunt(emprunt): Observable<any> {
    return this.http.post(`${this.url}addemprunt`, emprunt);
  }

  public confirmerEmprunt(emprunt): Observable<any> {
    return this.http.put(`${this.url}confirmeremprunt`, emprunt);
  }

  public reglerEmprunt(emprunt): Observable<any> {
    return this.http.put(`${this.url}regleremprunt`, emprunt);
  }

  public oneEmprunt(id): Observable<Emprunt> {
    return this.http.get<Emprunt>(`${this.url}oneemprunt/${id}`);
  }
  public deleteEmprunt(id) {
    return this.http.delete(`${this.url}deleteemprunt/${id}`);
  }

  //-----------------------------------------------------------------------

  public getReservationsEnCours(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}encoursreservations`);
  }

  public getReservationsReglees(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}regleesreservations`);
  }

  public reglerReservation(reservation): Observable<any> {
    return this.http.put(`${this.url}reglerreservation`, reservation);
  }

  public addReservation(reservation): Observable<any> {
    return this.http.post(`${this.url}addreservation`, reservation);
  }

  public oneReservation(id): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}onereservation/${id}`);
  }
  public deleteReservation(id) {
    return this.http.delete(`${this.url}deletereservation/${id}`);
  }

//---------------------------------------------------------------------------------------------------------------------------

public editBiblio(biblio): Observable<any> {
  return this.http.put(`${this.url}updatebiblio`, biblio);
}

public oneBiblio(id): Observable<Bibliothecaire> {
  return this.http.get<Bibliothecaire>(`${this.url}onebiblio/${id}`);
}

//---------------------------------------------------------------------------------------------------------------------------

  public sendEmailEtudiant(email : any): Observable<any> {
    return this.http.post(`${this.url}emailetudiant`, email);
  }

  public sendEmailAgent(email : any): Observable<any> {
    return this.http.post(`${this.url}emailagent`, email);
  }

  public sendEmailLivre(email : any): Observable<any> {
    return this.http.post(`${this.url}emaillivre`, email);
  }



  verfierNumdoss(num: string, objects: any[]) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].numeroDossier === num) {
        return true;
      }
    }
    return false;
  }

  verfierNumdoss1(object: any, objects: any[]) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].userIduser !== object.userIduser) {
      if (objects[i].numeroDossier === object.numeroDossier) {
        return true;
      }
    }
  }
  return false;
}

  verifier(email: string, objects: any[]): boolean {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].email === email) {
        return true;
      }
    }
    return false;
  }

  verifier1(object: any, objects: any[]): boolean {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].iduser !== object.userIduser) {
        if (objects[i].email === object.user.email) {
          return true;
        }
      }
    }
    return false;
  }

  genererNumero() {
    let table = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let chaine = '';
    let a = 0;
    for (let i = 0; i < 9; i++) {
      a = Math.random();
      a = Math.round(a * 9);
      chaine += table[a];
    }
    return Number.parseInt(chaine);
  }

}
