import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestcamPage } from './testcam.page';

describe('TestcamPage', () => {
  let component: TestcamPage;
  let fixture: ComponentFixture<TestcamPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestcamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
