import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabnutriPage } from './tabnutri.page';

describe('TabnutriPage', () => {
  let component: TabnutriPage;
  let fixture: ComponentFixture<TabnutriPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TabnutriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
