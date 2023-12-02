import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineRollComponent } from './machine-roll.component';

describe('MachineRollComponent', () => {
  let component: MachineRollComponent;
  let fixture: ComponentFixture<MachineRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineRollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
