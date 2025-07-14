import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignExamComponent } from './assign-exam.component';

describe('AssignExamComponent', () => {
  let component: AssignExamComponent;
  let fixture: ComponentFixture<AssignExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
