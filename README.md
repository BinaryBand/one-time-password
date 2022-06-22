# One-Time Password

A simple library for deriving one-time passwords from a base32 key.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Installing

Requirements:

  - Node.js
  - NPM (Node.js package manager)

<!-- Install with:

    npm install one-time-password -->

### How To Use

    import * as OTP from 'one-time-password';


    const dummyKey: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234';

    const token: string = OTP.generate(dummyKey);

    console.log(OTP.verify(dummyKey, token));

## Built With

  - [Contributor Covenant](https://www.contributor-covenant.org/) - Used
    for the Code of Conduct
  - [Creative Commons](https://creativecommons.org/) - Used to choose
    the license

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning.

## Authors

  - **Billie Thompson** - *Provided README Template* -
    [PurpleBooth](https://github.com/PurpleBooth)
  - **Shane Davenport** - *Library Author* -
    [Github](https://github.com/BinaryBand)

## License

This project is licensed under the [MIT License](https://license.md/)
Creative Commons License - see the [LICENSE.md](https://license.md/) file for details.

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc
