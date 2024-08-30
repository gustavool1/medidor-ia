class NotFoundMeasure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundMeasure";
  }
}

export { NotFoundMeasure };
