import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaClienteComponent } from './tienda-cliente.component';

describe('TiendaClienteComponent', () => {
  let component: TiendaClienteComponent;
  let fixture: ComponentFixture<TiendaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiendaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
