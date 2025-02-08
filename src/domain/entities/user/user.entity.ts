export class User {
  private _password: string;
  private _email: string;
  private _id: string;

  constructor(id?: string) {
    this._id = id;
  }

  public static buildUser(password: string, email: string, id: string): User {
    const user = new User();
    user._password = password;
    user._email = email;
    user._id = id;
    return user;
  }

  get password(): string {
    return this._password;
  }

  get email(): string {
    return this._email;
  }

  get id(): string {
    return this._id;
  }
}
