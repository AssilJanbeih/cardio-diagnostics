import { Injectable } from '@angular/core'
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { BehaviorSubject } from 'rxjs'
import AggregatorModel from '../models/aggregator.model'

@Injectable({
  providedIn: 'root',
})
export class AggregatorService {
  AggregatorModel: AngularFirestoreCollection<AggregatorModel>
  readonly aggregators$ = new BehaviorSubject<any | null>(null)

  constructor() {}

  setAggregatorData(data): void {
    this.aggregators$.next(data)
  }
  update(id: string, data: any): Promise<void> {
    return this.AggregatorModel.doc(id).update(data)
  }
  delete(id: string): Promise<void> {
    return this.AggregatorModel.doc(id).delete()
  }
}
