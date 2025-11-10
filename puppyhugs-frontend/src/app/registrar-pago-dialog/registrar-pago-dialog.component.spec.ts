import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPagoDialogComponent } from './registrar-pago-dialog.component';

describe('RegistrarPagoDialogComponent', () => {
  let component: RegistrarPagoDialogComponent;
  let fixture: ComponentFixture<RegistrarPagoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPagoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarPagoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
