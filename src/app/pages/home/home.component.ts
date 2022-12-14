import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  chunks = [
    'C',
    'Anchor',
    'PR',
    'M',
    'E',
    'NS1',
    'NS2A',
    'NS2B',
    'NS3',
    'NS4A',
    '2k',
    'NS4B',
    'NS5',
  ]

  constructor(
    protected router: Router
  ) { }

  ngOnInit(): void {
  }

  goToChunk(chunk: string) {
    this.router.navigate(['/results', chunk], {relativeTo: this.router.routerState.root});
  }
}
