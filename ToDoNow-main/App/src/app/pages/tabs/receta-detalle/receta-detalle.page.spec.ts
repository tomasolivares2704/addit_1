import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaDetallePage } from './receta-detalle.page';

describe('RecetaDetallePage', () => {
  let component: RecetaDetallePage;
  let fixture: ComponentFixture<RecetaDetallePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecetaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
