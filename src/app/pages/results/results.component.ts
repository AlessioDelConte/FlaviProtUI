import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map, shareReplay, switchMap, tap} from "rxjs/operators";
import {ProteinService} from "../../protein.service";
import {TaxonEntry} from "../../protein";
import {BehaviorSubject, combineLatest, zip} from "rxjs";

export interface TaxonFiltering {
  groups: Array<TaxonEntry>;
  subGroups: Array<TaxonEntry>;
  species: Array<TaxonEntry>;
  genus: Array<TaxonEntry>;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  // Emitter for page redirect
  chunk$ = this.route.params.pipe(
    map(params => params['chunk']),
    shareReplay(1),
  );

  proteins$ = this.chunk$.pipe(
    switchMap(chunk => this.proteinService.getProteins(chunk)),
    shareReplay(1),
  );

  filters$ = this.proteins$.pipe(
    map(proteins => {
      // Extract the set of unique values for each filter (group, subgroup, species, genus)
      let group = new Map<string, TaxonEntry>();
      let subGroup = new Map<string, TaxonEntry>();
      let species = new Map<string, TaxonEntry>();
      let genus = new Map<string, TaxonEntry>();

      proteins.forEach(protein => {
        group.set(protein.group!.shortName, protein.group!);
        subGroup.set(protein.subGroup!.shortName, protein.subGroup!);
        species.set(protein.species!.shortName, protein.species!);
        genus.set(protein.genus!.shortName, protein.genus!);
      });

      return {
        groups: Array.from(group.values()),
        subGroups: Array.from(subGroup.values()),
        species: Array.from(species.values()),
        genus: Array.from(genus.values()),
      }
    }),
    shareReplay(1),
  );

  appliedFilters$ = new BehaviorSubject({
    groups: new Array<TaxonEntry>(),
    subGroups: new Array<TaxonEntry>(),
    species: new Array<TaxonEntry>(),
    genus: new Array<TaxonEntry>()
  });

  proteinsFiltered$ = combineLatest([this.proteins$, this.appliedFilters$]).pipe(
    tap(([proteins, filters]) => console.log("Proteins", proteins.length)),
    map(([proteins, filters]) => {
      return proteins.filter(
        protein => filters.groups.map(g => g.shortName).includes(protein.group!.shortName) &&
          filters.subGroups.map(g => g.shortName).includes(protein.subGroup!.shortName) &&
          filters.species.map(g => g.shortName).includes(protein.species!.shortName) &&
          filters.genus.map(g => g.shortName).includes(protein.genus!.shortName)
      );
    })
  );

  constructor(
    protected proteinService: ProteinService,
    protected route: ActivatedRoute,
    protected http: HttpClient
  ) {
  }

  ngOnInit(): void {
  }

  applyFilters($event: TaxonFiltering) {
    console.log("Applying filters", $event);
    this.appliedFilters$.next($event);
  }
}
