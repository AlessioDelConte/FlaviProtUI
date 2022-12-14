import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaxonEntry} from "../../../protein";
import {FormArray, FormBuilder, FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";

declare var bootstrap: any;

@Component({
  selector: 'app-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss']
})
export class FilterHeaderComponent implements OnInit, AfterViewInit, AfterContentInit {

  @Input()
  filters!: { groups: Array<TaxonEntry>, subGroups: Array<TaxonEntry>, species: Array<TaxonEntry>, genus: Array<TaxonEntry> };

  @Output()
  appliedFilters$ = new EventEmitter<{ groups: Array<TaxonEntry>, subGroups: Array<TaxonEntry>, species: Array<TaxonEntry>, genus: Array<TaxonEntry> }>();

  form = this.formBuilder.group({
    groups: new FormArray([]),
    subGroups: new FormArray([]),
    species: new FormArray([]),
    genus: new FormArray([]),
  });

  form$ = this.form.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map(value => {
      this.appliedFilters$.emit({
        groups: this.filters.groups.filter((v, i) => value.groups[i]),
        subGroups: this.filters.subGroups.filter((v, i) => value.subGroups[i]),
        species: this.filters.species.filter((v, i) => value.species[i]),
        genus: this.filters.genus.filter((v, i) => value.genus[i]),
      });
    })
  );

  constructor(
    protected formBuilder: FormBuilder,
  ) {
  }

  ngAfterViewInit(): void {
    this.addCheckboxes();
  }

  ngAfterContentInit() {
    const tooltipTriggerList: any = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  get groupsFormArray(): FormArray {
    return this.form.get('groups') as FormArray;
  }

  get subGroupsFormArray(): FormArray {
    return this.form.get('subGroups') as FormArray;
  }

  get speciesFormArray(): FormArray {
    return this.form.get('species') as FormArray;
  }

  get genusFormArray(): FormArray {
    return this.form.get('genus') as FormArray;
  }

  private addCheckboxes() {
    this.filters.groups.forEach(() => this.groupsFormArray.push(new FormControl(true)));
    this.filters.subGroups.forEach(() => this.subGroupsFormArray.push(new FormControl(true)));
    this.filters.species.forEach(() => this.speciesFormArray.push(new FormControl(true)));
    this.filters.genus.forEach(() => this.genusFormArray.push(new FormControl(true)));
  }

  ngOnInit(): void {
  }

}
