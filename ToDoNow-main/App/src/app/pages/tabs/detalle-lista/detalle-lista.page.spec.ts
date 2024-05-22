import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleListaPage } from './detalle-lista.page';

describe('DetalleListaPage', () => {
  let component: DetalleListaPage;
  let fixture: ComponentFixture<DetalleListaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
