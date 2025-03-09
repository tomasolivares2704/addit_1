import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetnewlistPage } from './detnewlist.page';

describe('DetnewlistPage', () => {
  let component: DetnewlistPage;
  let fixture: ComponentFixture<DetnewlistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetnewlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
