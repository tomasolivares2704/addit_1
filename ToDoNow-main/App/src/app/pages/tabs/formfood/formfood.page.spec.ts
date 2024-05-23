import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormfoodPage } from './formfood.page';

describe('FormfoodPage', () => {
  let component: FormfoodPage;
  let fixture: ComponentFixture<FormfoodPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormfoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
