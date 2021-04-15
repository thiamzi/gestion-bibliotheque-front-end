import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  subtitle: string;
  closeResult: string;
  constructor(private modalService: NgbModal) {}

  open(content1) {
    this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public close(){
    this.modalService.dismissAll()
  }

  openlg(content){
    this.modalService.open(content, { size: 'lg' });
  }
  openmd(content){
    this.modalService.open(content);
  }
}
