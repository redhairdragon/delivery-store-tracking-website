import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPriceComponent } from './upload-price.component';

describe('UploadPriceComponent', () => {
  let component: UploadPriceComponent;
  let fixture: ComponentFixture<UploadPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
