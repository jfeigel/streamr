import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamrComponent } from './streamr.component';

describe('StreamrComponent', () => {
  let component: StreamrComponent;
  let fixture: ComponentFixture<StreamrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
