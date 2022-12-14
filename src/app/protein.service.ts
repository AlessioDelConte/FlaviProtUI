import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../environments/environment";
import {Protein} from "./protein";

@Injectable({
  providedIn: 'root'
})
export class ProteinService {

  url = environment.ws;
  urls = {
    // URL to retrieve a chunk endpoint
    chunk: this.url + 'chunk/{0}',
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  public getProteins(chunk: string): Observable<Protein[]> {
    return this.http.get(this.urls.chunk.replace('{0}', chunk)).pipe(
      map((response: any) => response.map((annotation: any) => Protein.fromJson(annotation)))
    );
  }
}
