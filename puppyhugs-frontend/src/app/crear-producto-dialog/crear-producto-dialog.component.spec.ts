import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProductoDialogComponent } from './crear-producto-dialog.component';

describe('CrearProductoDialogComponent', () => {
  let component: CrearProductoDialogComponent;
  let fixture: ComponentFixture<CrearProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProductoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
