import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPromocionDialogComponent } from './crear-promocion-dialog.component';

describe('CrearPromocionDialogComponent', () => {
  let component: CrearPromocionDialogComponent;
  let fixture: ComponentFixture<CrearPromocionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPromocionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearPromocionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
