import ErrorWrapper from 'error-wrapper';

class InstallError extends ErrorWrapper {

  static get CODE_NOT_AUTHORIZED() { return 'not-authorized'; } ;

  static notAuthorizedError() { return new InstallError('insufficient privileges', InstallError.CODE_NOT_AUTHORIZED); }

  constructor (message, code)
  {
    super(message);
    this.props = { code }
  }

  get code() { return this.props.code; }
}

export { InstallError };
