import { Reservation } from './../modeles/reservation';
import { Emprunt } from './../modeles/emprunt';
import { Etudiant } from './../modeles/etudiant';
import { AuthserviceService, Userdetails } from './../Service/authservice.service';
import { Categorie } from './../modeles/categorie';
import { ModalService } from './../Service/modal.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from '../Service/database.service';
import { Image } from '../modeles/image';
import { FirebaseService } from '../Service/firebase.service';
import Swal from 'sweetalert2';
import { Livre } from '../modeles/livre';
import { delay } from 'rxjs/operators';
import { EmailModel } from '../modeles/EmailModel';

@Component({
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})

export class StarterComponent implements OnInit {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  timerInterval: any;
  titre: boolean = false;

  categorie: Categorie = {
    idcategorie: 0,
    nom: "",
    livreList: null
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

  subtitle: string;
  form: FormGroup;
  form1: FormGroup;
  categories: Categorie[] = [];
  livres: Livre[] = [];
  selectedFiles: FileList;
  currentFileUpload: Image;
  percentage: number;
  pathLivres = '/livres';
  livre: Livre = null;
  livresrecup: Livre[] = []

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

  emprunt = {
    numeroEmprunt: 0,
    dateDebut: null,
    delai_recup: null,
    dateFin: null,
    dateremise: null,
    etudiantUserIduser: 0,
    livreIdlivre: 0
  }

  reservation = {
    numeroReservation: 0,
    date: null,
    dateFin: null,
    etudiantUserIduser: 0,
    livreIdlivre: 0
  }

  constructor(private modal: ModalService, private build: FormBuilder, private auth: AuthserviceService, private data: DatabaseService, private uploadService: FirebaseService) {
    this.subtitle = 'This is some text within a card block.';
  }
  ngOnInit(): void {
    this.getAllCategories();
    this.livresrecup = this.livres;
    this.TousLesLivte();
    this.form = this.build.group({
      "titre": ['', [Validators.maxLength(45), Validators.required, Validators.minLength(2)]],
      "auteur": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2)]],
      "description": ['', [Validators.maxLength(1000), Validators.required, Validators.minLength(60)]],
      "exmplaire": [0, [Validators.required, Validators.min(1)]],
      "categorieIdcategorie": [0, Validators.required],
      "image": [''],
    })
    if (this.auth.Islogged()) {
      if (this.auth.getUserdetails().isEtudiant) {
        this.onEtudiant();
      }
    }

  }

  //Ouverture des modales----------------------------------------------------------------------------------------------------

  open2(content2, livre) {
    this.modal.openlg(content2)
    this.livre = livre;
    this.OneCategorie(livre.categorieIdcategorie)
  }

  //rcuperetaion des categories---------------------------------------------------------------------------------------------------
  getAllCategories() {
    this.data.getAllCategories().subscribe(data => {
      this.categories = data;
      this.categories.reverse();
    })
  }

  //recuperation des livres-----------------------------------------------------------------------------------------------------------
  TousLesLivte() {
    this.data.getAllLivres().subscribe(res => {
      this.livres = res;
      this.livresrecup = this.livres;
    })
  }

  //recuperer un categorie-------------------------------------------------------------------------------------------------------
  OneCategorie(id) {
    this.data.oneCategorie(id).subscribe(cate => {
      this.categorie = cate;
    })
  }

  //emprunter livre----------------------------------------------------------------------------------------------------------------
  emprunter(livre: Livre) {
    if (this.NonRegleEmprunt(this.etudiant.empruntList) == false) {
      if (this.auth.getUserdetails().isEtudiant) {
        this.data.oneUser(this.auth.getUserdetails().sub).subscribe(res => {
          this.emprunt.numeroEmprunt = this.data.genererNumero();
          this.emprunt.livreIdlivre = livre.idlivre;
          this.emprunt.etudiantUserIduser = res.iduser;

          this.swalWithBootstrapButtons1
            .fire({
              title: "Etes vous sûre?",
              text: "Vous ne pourrez pas revenir en arrière!",
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
           
                  this.data.addEmprunt(this.emprunt).subscribe(_ => {
                      this.modal.close();
                      this.ngOnInit();
                      this.swalWithBootstrapButtons.fire(
                        "Validé!",
                        "Emprunt reussi avec succes!! Vous allez recevoir un email pour plus de details.",
                        "success"
                      );
                 
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

  //reserver livre---------------------------------------------------------------------------------------------------------------
  resrever(livre: Livre) {
    if (!this.NonRegleReservation(this.etudiant.reservationList)) {
      if (this.auth.getUserdetails().isEtudiant) {
        this.data.oneUser(this.auth.getUserdetails().sub).subscribe(res => {
          this.reservation.numeroReservation = this.data.genererNumero();
          this.reservation.livreIdlivre = livre.idlivre;
          this.reservation.etudiantUserIduser = res.iduser;

          this.swalWithBootstrapButtons1
            .fire({
              title: "Etes vous sûre?",
              text: "Vous ne pourrez pas revenir en arrière!",
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
                  this.data.addReservation(this.reservation).subscribe(reservation => {
                    this.modal.close();
                    this.ngOnInit();
                    this.swalWithBootstrapButtons.fire(
                      "Validé!",
                      "Réservation enregistrée avec succes!! Vous allez recevoir un email pour plus de details.",
                      "success"
                    );

                    }, err => {
                      this.swalWithBootstrapButtons.fire(
                        "Erreur!",
                        "Une erreur est survenue lors de l'annulation",
                        "error"
                      );
                    })
                
            
              }
            });

        }, error => {
          this.swalWithBootstrapButtons.fire(
            "Erreur!",
            "Une erreur est survenue lors de la réservation",
            "error"
          );
        })
      }
    }
    else {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Vous avez deja une reservation en cours",
        "error"
      );
    }

  }

  //Rechercher livre
  rechercherLivre(e) {
    const resultats1: Livre[] = [];
    for (const livre of this.livres) {
      if (livre.auteur.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) != -1
        || livre.titre.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(livre);
      }
    }
    this.livres = resultats1;

    if (resultats1.length === 0 || !e.target.value) {
      this.livres = this.livresrecup;

    }
  }

  //recuperer les livres d'un categories
  livresCategorie(e) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].nom === e.target.value) {
        this.OneCategorie(this.categories[i].idcategorie);
        this.titre = true;
        this.livres = this.categories[i].livreList;
        this.livresrecup = this.categories[i].livreList;
      }
      if ("tous les livres" === e.target.value) {
        this.TousLesLivte();
        this.titre = false;
      }
    }
  }

  isEtudiant(): boolean {
    if (this.auth.Islogged()) {
      if (this.auth.getUserdetails().isEtudiant) {
        return true;
      }
      return false;
    }
    else {
      false;
    }

  }

  isAdmin(): boolean {
    if (this.auth.Islogged()) {
      if (this.auth.getUserdetails().isAdmin) {
        return true;
      }
      return false;
    }
    else {
      false;
    }

  }

  onEtudiant() {
    this.data.oneUser(this.auth.getUserdetails().sub).subscribe(res => {
      this.data.oneEtudiant(res.iduser).subscribe(res1 => {
        this.etudiant = res1;
      })
    })
  }

  NonRegleEmprunt(list: Emprunt[]) {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].regle) {
        return true
      }
    }
    return false;
  }

  NonRegleReservation(list: Reservation[]) {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].regle) {
        return true;
      }
    }
    return false;
  }
}
