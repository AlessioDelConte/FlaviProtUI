import {Annotation} from "./annotation";

export interface TaxonEntry {
  shortName: string;
  longName: string;
}

interface IProtein {
  uniprot: string;
  name: string;
  alignedSequence: string;
  organism: string;
  strain: string;
  shortName: string;
  genus?: TaxonEntry;
  group?: TaxonEntry;
  subGroup?: TaxonEntry;
  species?: TaxonEntry;
  annotations: Annotation[];
}

export interface Protein extends IProtein {
}

export class Protein implements Protein {
  // Constructor
  constructor({
                uniprot,
                name,
                alignedSequence,
                organism,
                strain,
                shortName,
                genus,
                group,
                subGroup,
                species,
                annotations
              }: IProtein) {
    // Store attributes
    this.uniprot = uniprot;
    this.name = name;
    this.alignedSequence = alignedSequence;
    this.organism = organism;
    this.strain = strain;
    this.shortName = shortName;
    this.genus = genus;
    this.group = group;
    this.subGroup = subGroup;
    this.species = species;
    this.annotations = annotations;
  }

  // Parse task from JSON document
  public static fromJson(json: any): Protein {
    // Define Protein parameters
    let annotations = json.annotations.map((annotation: any) => Annotation.fromJson(annotation))
    let taxonomy = json.taxonomy;
    // Return a Prediction instance
    return new Protein({
      uniprot: json.uniprot,
      name: json.name,
      alignedSequence: json.aligned_sequence,
      organism: json.organism,
      strain: json.strain,
      shortName: json.short_name,
      genus: taxonomy["genus"] ? {
        shortName: taxonomy["genus"]["short-name"],
        longName: taxonomy["genus"]["long-name"]
      } : undefined,
      group: taxonomy["group"] ? {
        shortName: taxonomy["group"]["short-name"],
        longName: taxonomy["group"]["long-name"]
      } : undefined,
      subGroup: taxonomy["sub-group"] ? {
        shortName: taxonomy["sub-group"]["short-name"],
        longName: taxonomy["sub-group"]["long-name"]
      } : undefined,
      species: taxonomy["species"] ? {
        shortName: taxonomy["species"]["short-name"],
        longName: taxonomy["species"]["long-name"]
      } : undefined,
      annotations
    })
  };
}
