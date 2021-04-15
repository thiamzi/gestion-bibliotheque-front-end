import { User } from './../modeles/user';
import { Agent } from './../modeles/agent';
import { ModalService } from './../Service/modal.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from '../Service/database.service';
import Swal from 'sweetalert2';
import { MustMatch } from '../validator/mustmatch';
import { EmailModel } from '../modeles/EmailModel';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

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

  form: FormGroup;
  form1: FormGroup;

  agents: Agent[] = [];
  user: User = {
    iduser: 0,
    email: "",
    password: "",
    role: ""
  };

  agent: Agent = {
    userIduser: 0,
    nom: '',
    prenom: '',
    user: null
  }
  users: User[] = [];

  Model: EmailModel = {
    objet: "Création de compte",
    destinataire: "",
    message: "Le bibliothecaire a crée un compte agent à votre nom. Les identifiants de votre compte sont ci-dessous.",
    numero: "",
    password: ""
  }
  constructor(private build: FormBuilder, private modal: ModalService, private data: DatabaseService) { }

  ngOnInit(): void {
    this.getAllAgents();
    this.getAllUsers();
    this.form = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
    })

    this.form1 = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
    })
  }

  open1(content1) {
    this.ngOnInit()
    this.modal.open(content1)
  }

  open2(content2, agent) {
    this.form1.patchValue(agent)
    this.form1.patchValue(agent.user)
    this.agent = agent;
    this.user = agent.user;
    this.modal.open(content2)
  }

  getAllAgents() {
    this.data.getAllAgents().subscribe(res => {
      this.agents = res;
      this.agents.reverse();
    })
  }

  addAgent() {
    this.user.email = this.form.get('email').value;
    this.user.password = this.data.genererNumero().toString();
    this.user.role = "ROLE_AGENT";
    this.Model.destinataire = this.user.email;
    this.Model.password = this.user.password;
    this.getAllUsers();
    if (this.data.verifier(this.user.email, this.users) == true) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "L'adesse email que vous avez entre existe deja",
        "error"
      );
    }
    else {
      Swal.fire({
        title: 'veuillez patientez!',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      })
      this.data.sendEmailAgent(this.Model).subscribe(_ => {
      this.data.addUser(this.user).subscribe(res => {
        this.agent.userIduser = res.iduser;
        this.agent.nom = this.form.get('nom').value;
        this.agent.prenom = this.form.get('prenom').value;
        this.data.addAgent(this.agent).subscribe(_ => {
            this.ngOnInit()
            this.modal.close()
            this.swalWithBootstrapButtons.fire(
              "Validé!",
              "Compte agent crée  avec succes",
              "success"
            );
          }, err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de l'ajout",
              "error"
            );
          })
        }, _ => {
          this.swalWithBootstrapButtons.fire(
            "erreur!",
            "Une erreur est survenu lors l'ajout. Veuillez reessayer plutard!",
            "error"
          );
        })
      }, _ => {
        this.swalWithBootstrapButtons.fire(
          "erreur!",
          "Une erreur est survenu lors de l'envoie du mail. Veuillez reessayer plutard!",
          "error"
        );
      })
    }

  }

  deleteAgent(id) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer!",
        cancelButtonText: "No, annuler!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.data.deleteAgent(id).subscribe(res => {
            this.getAllAgents();
            this.swalWithBootstrapButtons.fire(
              "Supprimé!",
              "Categorie supprimée avec succes",
              "success"
            );
          },
            err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de la suppression",
                "error"
              );
            }
          );
        }
      });
  }

  editAgent() {
    this.user.email = this.form1.get('email').value;
    this.getAllUsers();
    if (this.data.verifier1(this.agent, this.users)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "L'adesse email que vous avez entre existe deja",
        "error"
      );
    }
    else {
      this.data.editUser(this.user).subscribe(res => {
        this.agent.nom = this.form1.get('nom').value;
        this.agent.prenom = this.form1.get('prenom').value;
        this.data.editAgent(this.agent).subscribe(_ => {
          this.modal.close()
          this.swalWithBootstrapButtons.fire(
            "modifieé!",
            "Categorie modifiée avec succes.",
            "success"
          );
          this.getAllAgents()
        })
      })
    }
  }

  getAllUsers() {
    this.data.getAllUsers().subscribe(res => {
      this.users = res;
    })
  }


}
