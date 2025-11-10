import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAdminComponent } from './ventas-admin.component';

describe('VentasAdminComponent', () => {
  let component: VentasAdminComponent;
  let fixture: ComponentFixture<VentasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
