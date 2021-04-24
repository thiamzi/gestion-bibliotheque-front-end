import { Emprunt } from './../modeles/emprunt';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Etudiant } from '../modeles/etudiant';
import { Livre } from '../modeles/livre';
import { AuthserviceService, Userdetails } from '../Service/authservice.service';
import { DatabaseService } from '../Service/database.service';
import { ModalService } from '../Service/modal.service';

@Component({
  selector: 'app-mes-emprunts',
  templateUrl: './mes-emprunts.component.html',
  styleUrls: ['./mes-emprunts.component.css']
})
export class MesEmpruntsComponent implements OnInit {

  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
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

  empruntCours:Emprunt;
  emprunt : Emprunt;

  constructor(private auth: AuthserviceService, private data: DatabaseService, private modal: ModalService) { }

  ngOnInit(): void {
    this.date = new Date;
    this.user = this.auth.getUserdetails();
    this.getUser();
  }

  open2(content2, emprunt: Emprunt) {
    this.emprunt = emprunt;
    this.getEtudiant(emprunt.etudiantUserIduser);
    this.getLivre(this.emprunt.livreIdlivre);
    this.modal.openmd(content2);
  }

  getUser() {
    this.data.oneUser(this.user.sub).subscribe(res => {
      if (this.user.isEtudiant == true) {
        this.data.oneEtudiant(res.iduser).subscribe(res1 => {
          this.etudiant = res1;
          for (let i = 0; i < this.etudiant.empruntList.length; i++) {
            if (this.etudiant.empruntList[i].regle == false) {
              this.empruntCours = this.etudiant.empruntList[i];
              this.etudiant.reservationList.splice(i, 1)
            }
          }
          if (this.empruntCours != null) {
            this.getLivre(this.empruntCours.livreIdlivre);
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

  annulerEmprunt(id, livre) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
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
            this.data.deleteEmprunt(id).subscribe(res => {
              this.empruntCours=null;
              this.ngOnInit();
              this.swalWithBootstrapButtons.fire(
                "Annulé!",
                "Reservation annuler avec succes",
                "success"
              );
            }, err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de l'annulation",
                "error"
              );
            })
          }, err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de l'annulation",
              "error"
            );
          }
          )
        }
      })
  }
}
