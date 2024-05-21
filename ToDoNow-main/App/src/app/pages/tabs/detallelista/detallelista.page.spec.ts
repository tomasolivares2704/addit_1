import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallelistaPage } from './detallelista.page';

describe('DetallelistaPage', () => {
  let component: DetallelistaPage;
  let fixture: ComponentFixture<DetallelistaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetallelistaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
