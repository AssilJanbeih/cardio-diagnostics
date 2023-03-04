import { TestBed } from '@angular/core/testing';

import { CustonerProfileResolver } from './custoner-profile.resolver';

describe('CustonerProfileResolver', () => {
  let resolver: CustonerProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CustonerProfileResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
