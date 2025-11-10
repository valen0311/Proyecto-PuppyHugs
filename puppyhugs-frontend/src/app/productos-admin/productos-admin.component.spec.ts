import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosAdminComponent } from './productos-admin.component';

describe('ProductosAdminComponent', () => {
  let component: ProductosAdminComponent;
  let fixture: ComponentFixture<ProductosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
