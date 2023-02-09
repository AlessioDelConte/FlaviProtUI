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

const CUSTOM_PROTEIN_ALPHABET = [
  {"color": "#80a0f0", "regex": "A"},
  {"color": "#80a0f0", "regex": "I"},
  {"color": "#80a0f0", "regex": "L"},
  {"color": "#80a0f0", "regex": "M"},
  {"color": "#80a0f0", "regex": "F"},
  {"color": "#80a0f0", "regex": "W"},
  {"color": "#f01505", "regex": "K"},
  {"color": "#f01505", "regex": "R"},
  {"color": "#c048c0", "regex": "E"},
  {"color": "#c048c0", "regex": "D"},
  {"color": "#15c015", "regex": "N"},
  {"color": "#15c015", "regex": "Q"},
  {"color": "#15c015", "regex": "S"},
  {"color": "#15c015", "regex": "T"},
  {"color": "#f09048", "regex": "C"},
  {"color": "#f09048", "regex": "G"},
  {"color": "#c0c000", "regex": "P"},
  {"color": "#15a4a4", "regex": "H"},
  {"color": "#15a4a4", "regex": "Y"},
];


const CUSTOM_DSSP_ALPHABET = [
  {"color": "#a00080", "regex": "G"},
  {"color": "#ff0080", "regex": "H"},
  {"color": "#600080", "regex": "I"},
  {"color": "#ffc800", "regex": "E"},
  {"color": "#6080ff", "regex": "B"},
  {"color": "#66d8c9", "regex": "S"},
  {"color": "#00b266", "regex": "T"},
];

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
    if (this.proteins != undefined && this.proteins.length > 0) {
      console.log("Proteins changed", this.proteins.length);
      let sequences = [];
      let dssp: { id: number; dssp: string; label: string; }[] = [];
      let currIdx = 0;
      for (const protein of this.proteins) {
        currIdx += 1;
        sequences.push({
          id: currIdx,
          sequence: protein.alignedSequence.replace(/-/g, '-'),
          label: `${protein.uniprot} ${protein.group?.shortName} ${protein.subGroup?.shortName}`
        });
        let secstrs = protein.annotations.filter(a => a.name.includes("secstr"));
        secstrs.forEach(secstr => {
          let secstrStr = (secstr.values as any[]).filter(v => v != ',').map(v => v == null ? '-' : v == '.' ? '-' : v.toString()).join('');
          dssp.push({
            id: currIdx,
            dssp: secstrStr,
            label: `${secstr.name} ${protein.uniprot}`
          });
        })

      }
      // Emit input
      this.input$.next({sequences, options: this.options});

      //  Define a fasta variable that contains all the sequences in fasta format
      let fasta = sequences.map(seq => `${seq.sequence}`).join('\n');
      let dssps = dssp.map(seq => `${seq.dssp}`).join('\n');

      if (sequences.length > 0) {
        let width = (sequences[0].sequence.length + 1) * 9.627;
        logojs.embedProteinLogo(document.getElementById("protLogo"), {
          fasta: fasta,
          noFastaNames: true,
          scale: width,
          height: 80,
          alphabet: CUSTOM_PROTEIN_ALPHABET,
        });
        logojs.embedProteinLogo(document.getElementById("dsspLogo"), {
          fasta: dssps,
          noFastaNames: true,
          scale: width,
          height: 80,
          alphabet: CUSTOM_DSSP_ALPHABET,
          mode: "INFORMATION_CONTENT"
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
