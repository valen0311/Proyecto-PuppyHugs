import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebardAdminComponent } from './sidebard-admin.component';

describe('SidebardAdminComponent', () => {
  let component: SidebardAdminComponent;
  let fixture: ComponentFixture<SidebardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebardAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
