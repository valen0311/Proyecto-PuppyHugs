import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresAdminComponent } from './proveedores-admin.component';

describe('ProveedoresAdminComponent', () => {
  let component: ProveedoresAdminComponent;
  let fixture: ComponentFixture<ProveedoresAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProveedoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
