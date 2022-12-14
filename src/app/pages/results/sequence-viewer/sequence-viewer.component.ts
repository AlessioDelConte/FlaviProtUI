import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Protein} from "../../../protein";
import {ProSeqViewer} from "proseqviewer/dist";
import {combineLatest, ReplaySubject} from "rxjs";
import {map} from "rxjs/operators";

const logojs = require("logojs-react");

@Component({
  selector: 'app-sequence-viewer',
  templateUrl: './sequence-viewer.component.html',
  styleUrls: ['./sequence-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SequenceViewerComponent implements OnChanges, AfterContentInit {
  @Input()
  proteins!: Protein[];

  // Observable for ProSeqViewer item
  viewer$ = new ReplaySubject<ProSeqViewer>();

  // Observable for viewer input
  input$ = new ReplaySubject<any>();

  // Observable for updating viewer
  update$ = combineLatest([this.viewer$, this.input$]).pipe(
    map(([viewer, input]) => {
      // Update viewer
      viewer.draw(input);
      // Just return void
      return void 0;
    }),
  );
  // Options and configuration
  options = {chunkSize: 20, sequenceColor: 'clustal', wrapLine: false, indexesLocation: 'top', fontSize: '16px'};

  showLogo = true;
  showAlignment = true;

  constructor() {
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges["proteins"]) {
      console.log("Proteins changed", this.proteins.length);
      let sequences = [];
      let currIdx = 0;
      for (const protein of this.proteins) {
        currIdx += 1;
        sequences.push({
          id: currIdx,
          sequence: protein.alignedSequence.replace(/-/g, '-'),
          label: `${protein.uniprot} ${protein.group?.shortName} ${protein.subGroup?.shortName}`
        });
      }
      // Emit input
      this.input$.next({sequences, options: this.options});

      //  Define a fasta variable that contains all the sequences in fasta format
      let fasta = sequences.map(seq => `${seq.sequence}`).join('\n');
      if (sequences.length > 0) {
        let width = (sequences[0].sequence.length + 1) * 9.6;
        logojs.embedProteinLogo(document.getElementById("logo"), {
          fasta: fasta,
          noFastaNames: true,
          scale: width,
          height: 80
        });
      }
    }
  }

  ngAfterContentInit() {
    // Define ProSeqViewer instance
    let viewer = new ProSeqViewer('psv');
    // Emit feature viewer
    this.viewer$.next(viewer);
  }
}
