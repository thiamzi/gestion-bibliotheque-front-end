import { ModalService } from './../Service/modal.service';
import { Etudiant } from './../modeles/etudiant';
import { DatabaseService } from './../Service/database.service';
import { Component, OnInit } from '@angular/core';
import { AuthserviceService, Userdetails } from '../Service/authservice.service';
import { Reservation } from '../modeles/reservation';
import { Livre } from '../modeles/livre';
import Swal from 'sweetalert2';
import { Emprunt } from '../modeles/emprunt';
import { EmailModel } from '../modeles/EmailModel';

@Component({
  selector: 'app-mes-reservations',
  templateUrl: './mes-reservations.component.html',
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {

  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
  }

  emprunt = {
    numeroEmprunt: 0,
    dateDebut: null,
    delai_recup: null,
    dateFin: null,
    dateremise: null,
    etudiantUserIduser: 0,
    livreIdlivre: 0
  }

  date: Date;

  etudiant: Etudiant = {
    userIduser: 0,
    numeroDossier: 0,
    nom: "",
    prenom: "",
    dateNaissance: null,
    dateCreation: null,
    user: null,
    empruntList: null,
    reservationList: null
  };

  livre: Livre = {
    idlivre: 0,
    titre: "",
    auteur: "",
    description: "",
    exmplaire: 0,
    nbdisponible: 0,
    imageCle: {
      cle: 0,
      nom: "",
      url: "",
      file: null
    },
    dateCreation: null,
    empruntList: [],
    reservationList: [],
    categorieIdcategorie: 0
  };

  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });

  swalWithBootstrapButtons1 = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: true
  });

  Model: EmailModel = {
    objet: "Emprunt livre",
    destinataire: "",
    message: "",
    numero: "",
    password: ""
  }
  reservation: Reservation;
  reservationCours: Reservation;
  constructor(private auth: AuthserviceService, private data: DatabaseService, private modal: ModalService) { }

  ngOnInit(): void {
    this.date = new Date;
    this.user = this.auth.getUserdetails();
    this.getUser();


  }

  open2(content2, reservation: Reservation) {
    this.reservation = reservation;
    this.getEtudiant(reservation.etudiantUserIduser);
    this.getLivre(this.reservation.livreIdlivre);
    this.modal.openmd(content2);
  }

  getUser() {
    this.data.oneUser(this.user.sub).subscribe(res => {
      if (this.user.isEtudiant == true) {
        this.data.oneEtudiant(res.iduser).subscribe(res1 => {
          this.etudiant = res1;
          for (let i = 0; i < this.etudiant.reservationList.length; i++) {
            if (this.etudiant.reservationList[i].regle == false) {
              this.reservationCours = this.etudiant.reservationList[i];
              console.log(this.reservationCours)
              this.etudiant.reservationList.splice(i, 1)
            }
          }
          if (this.reservationCours != null) {
            this.getLivre(this.reservationCours.livreIdlivre);
          }
        })
      }
    })
  }

  getLivre(id) {
    this.data.oneLivre(id).subscribe(res => {
      this.livre = res;
    });
  }

  getEtudiant(id) {
    this.data.oneEtudiant(id).subscribe(res => {
      this.etudiant = res;
    });
  }

  annulerReservation(id, livre) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous s??re?",
        text: "Vous ne pourrez pas revenir en arri??re!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confirmer!",
        cancelButtonText: "No, annuler!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          livre.nbdisponible += 1;
          this.data.editLivre(livre).subscribe(res1 => {
            this.data.deleteReservation(id).subscribe(res => {
              this.reservationCours = null;
              this.ngOnInit();
              this.swalWithBootstrapButtons.fire(
                "Annul??!",
                "Reservation annuler avec succes",
                "success"
              );
            }, err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de la suppression",
                "error"
              );
            })
          }, err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de la suppression",
              "error"
            );
          })
        }
      })
  }

  //emprunter livre----------------------------------------------------------------------------------------------------------------
  emprunter(livre, etudiant) {
    console.log(this.reservationCours)
    if (this.NonRegleEmprunt(etudiant.empruntList) == false) {
      if (this.auth.getUserdetails().isEtudiant) {
        this.data.oneUser(this.auth.getUserdetails().sub).subscribe(res => {
    
          this.emprunt.numeroEmprunt = this.reservationCours.numeroReservation;
          this.emprunt.livreIdlivre = this.livre.idlivre;
          this.emprunt.etudiantUserIduser = res.iduser;

          this.swalWithBootstrapButtons1
            .fire({
              title: "Etes vous s??re?",
              text: "Vous ne pourrez pas revenir en arri??re!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Oui, valider!",
              cancelButtonText: "No, annuler!",
              reverseButtons: true
            })
            .then(result => {
              if (result.value) {
                Swal.fire({
                  title: 'veuillez patientez!',
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                })
   
              
                    this.data.addEmprunt(this.emprunt).subscribe(emp => {
                      this.data.reglerReservation(this.reservationCours).subscribe(rs => {
                        this.reservationCours = null;
                        this.ngOnInit();
                        this.swalWithBootstrapButtons.fire(
                          "Valid??!",
                          "Emprunt reussi avec succes!! Vous allez recevoir un email pour plus de details.",
                          "success"
                        );
                      }, err => {
                        this.swalWithBootstrapButtons.fire(
                          "Erreur!",
                          "Une erreur est survenue lors de l'annulation",
                          "error"
                        );
                      })
              
                 
                },
                  err => {
                    console.log(err)
                    this.swalWithBootstrapButtons.fire(
                      "Erreur!",
                      "Une erreur est survenue lors de l'emprunt",
                      "error"
                    );
                  })
              }
            });
        }, error => {
          this.swalWithBootstrapButtons.fire(
            "Erreur!",
            "Une erreur est survenue lors de l'emprunt",
            "error"
          );
        })
      }
    } else {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Vous avez deja un emprunt en cours",
        "error"
      );
    }

  }

  NonRegleEmprunt(list: Emprunt[]) {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].regle) {
        return true
      }
    }
    return false;
  }

}
