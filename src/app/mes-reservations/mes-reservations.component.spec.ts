import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesReservationsComponent } from './mes-reservations.component';

describe('MesReservationsComponent', () => {
  let component: MesReservationsComponent;
  let fixture: ComponentFixture<MesReservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesReservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
