import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosCompteComponent } from './infos-compte.component';

describe('InfosCompteComponent', () => {
  let component: InfosCompteComponent;
  let fixture: ComponentFixture<InfosCompteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosCompteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
