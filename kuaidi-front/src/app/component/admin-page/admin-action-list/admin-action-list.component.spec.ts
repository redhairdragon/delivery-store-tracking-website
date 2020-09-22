import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionListComponent } from './admin-action-list.component';

describe('AdminActionListComponent', () => {
  let component: AdminActionListComponent;
  let fixture: ComponentFixture<AdminActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
