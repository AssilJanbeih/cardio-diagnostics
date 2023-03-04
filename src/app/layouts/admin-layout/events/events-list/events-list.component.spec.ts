import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoicesListComponent } from "./events-list.component";

describe("InvoicesListComponent", () => {
  let component: InvoicesListComponent;
  let fixture: ComponentFixture<InvoicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
