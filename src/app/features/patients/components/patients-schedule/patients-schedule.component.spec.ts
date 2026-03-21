import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsScheduleComponent } from './patients-schedule.component';

describe('PatientsScheduleComponent', () => {
  let component: PatientsScheduleComponent;
  let fixture: ComponentFixture<PatientsScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
