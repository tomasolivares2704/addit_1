import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListacomprasPage } from './listacompras.page';

describe('ListacomprasPage', () => {
  let component: ListacomprasPage;
  let fixture: ComponentFixture<ListacomprasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListacomprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
