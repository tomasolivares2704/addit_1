import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewlistPage } from './newlist.page';

describe('NewlistPage', () => {
  let component: NewlistPage;
  let fixture: ComponentFixture<NewlistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
