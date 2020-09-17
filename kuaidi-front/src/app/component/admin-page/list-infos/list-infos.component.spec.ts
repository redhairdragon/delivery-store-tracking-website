import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInfosComponent } from './list-infos.component';

describe('ListInfosComponent', () => {
  let component: ListInfosComponent;
  let fixture: ComponentFixture<ListInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
