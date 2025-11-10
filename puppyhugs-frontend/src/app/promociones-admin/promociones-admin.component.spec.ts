import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesAdminComponent } from './promociones-admin.component';

describe('PromocionesAdminComponent', () => {
  let component: PromocionesAdminComponent;
  let fixture: ComponentFixture<PromocionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromocionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
