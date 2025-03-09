import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormrecetaPage } from './formreceta.page';

describe('FormrecetaPage', () => {
  let component: FormrecetaPage;
  let fixture: ComponentFixture<FormrecetaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormrecetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
