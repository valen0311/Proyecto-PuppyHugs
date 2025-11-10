import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProveedorDialogComponent } from './crear-proveedor-dialog.component';

describe('CrearProveedorDialogComponent', () => {
  let component: CrearProveedorDialogComponent;
  let fixture: ComponentFixture<CrearProveedorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProveedorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearProveedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
