class ConfirmationDuplicate extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfirmationDuplicate";
  }
}

export { ConfirmationDuplicate };
