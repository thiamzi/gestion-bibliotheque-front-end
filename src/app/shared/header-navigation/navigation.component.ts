import { AuthserviceService } from './../../Service/authservice.service';
import { Etudiant } from './../../modeles/etudiant';
import { ModalService } from './../../Service/modal.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/Service/database.service';
import { MustMatch } from 'src/app/validator/mustmatch';
import Swal from 'sweetalert2';
import { Image } from 'src/app/modeles/image';
import { FirebaseService } from 'src/app/Service/firebase.service';
import { User } from 'src/app/modeles/user';
import { Categorie } from 'src/app/modeles/categorie';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  valid: boolean = true;

  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });
  currentFileUpload: Image;
  pathEtudiant = '/etudiants';
  percentage: number;
  selectedFiles: FileList;
  form: FormGroup;
  timerInterval: any;
  users: User[] = [];
  etudiants: Etudiant[] = [];
  categories: Categorie[] = [];
  form2: FormGroup;

  public showSearch = false;
  constructor(private build: FormBuilder, private modal: ModalService, private data: DatabaseService, private auth: AuthserviceService, private uploadService: FirebaseService) { }

  open1(content1) {

    this.form2 = this.build.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })
    this.modal.open(content1);
  }

  open2(content2) {
    this.ngOnInit();
    this.modal.open(content2);
  }

  ngOnInit(): void {
    this.getAllEtudiants();
    this.getAllUsers();
    this.getAllCategories()
    this.form = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "numeroDossier": ['', [Validators.required, Validators.pattern(/[0-9]{11}/)]],
      "dateNaissance": ['', Validators.required],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
      "imageCle": ['', Validators.required],
      "password": ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      'confirm': ['', Validators.required],
    }, {
      'validator': MustMatch('password', 'confirm')
    });

  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  AjouterEtudiant() {
    Swal.fire({
      title: 'veuillez patientez!',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    })
    if (this.data.verfierNumdoss(this.form.get('numeroDossier').value, this.etudiants)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Le numero de dossier que vous avez entre existe deja",
        "error"
      );
    }
    else {
      if (this.data.verifier(this.form.get('email').value, this.users)) {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "L'adesse email que vous avez entre existe deja",
          "error"
        );
      } else {
        const file = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
        this.currentFileUpload = new Image(file);
        this.uploadService.pushFileToStorage1(this.currentFileUpload, this.pathEtudiant, this.form.value).subscribe(
          percentage => {
            this.percentage = Math.round(percentage);
          }
        );
      }
    }
  }

  async getAllUsers() {
    this.data.getAllUsers().subscribe(res => {
      this.users = res;
    });
  }

  async getAllEtudiants() {
    this.data.getAllEtudiants().subscribe(res => {
      this.etudiants = res;
    });
  }

  getAllCategories() {
    this.data.getAllCategories().subscribe(data => {
      this.categories = data;
      this.categories.reverse();
    })
  }

  login() {
    this.auth.connexion(this.form2.value).subscribe(res => {
      window.location.reload()
      this.modal.close();
    }, err => {
      this.valid = false;
    })
  }

  isLogged(): boolean {
    if (this.auth.Islogged() == true) {
      return true;
    }
    return false;
  }

  deconnexion() {
    this.auth.decoonexion();
    this.ngOnInit();
  }
}
