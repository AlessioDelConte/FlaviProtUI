interface IAnnotation {
  name: string;
  description?: string;
  taxon?: string;
  values: number[] | string[];
}

export interface Annotation extends IAnnotation {
}

export class Annotation implements Annotation {
  // Constructor
  constructor({name, description, taxon, values}: IAnnotation) {
    // Store attributes
    this.name = name;
    this.description = description;
    this.taxon = taxon;
    this.values = values;
  }

  // Parse task from JSON document
  public static fromJson(json: any): Annotation {
    // Return a Prediction instance
    return new Annotation({name: json.name, description: json.description, taxon: json.taxon, values: json.values});
  }
}
