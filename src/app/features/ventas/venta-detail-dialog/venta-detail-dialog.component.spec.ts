import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaDetailDialogComponent } from './venta-detail-dialog.component';

describe('VentaDetailDialogComponent', () => {
  let component: VentaDetailDialogComponent;
  let fixture: ComponentFixture<VentaDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
