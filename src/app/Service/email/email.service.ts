import { EmailModel } from './../../modeles/EmailModel';
import { Injectable } from '@angular/core';
import './../../../assets/js/smtp';

declare let Email: any;

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {
  }

  sendEmail(model: EmailModel) {
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: 'thiamzirabm@gmail.com',
      Password: '46A05DCEF469226DACAC1518E4793532B44E',
      To: model.destinataire,
      From: 'thiamzirabm@gmail.com',
      Subject: model.objet,
      Body: `
    <br/> <p>${model.message} <br><br> <b>merci de ne pas repondre</b></p> `
    }).then(res=>{
      console.log("kdsk" + res);
    })
  }

}
