# Trinity

Trinity is a new 2PC scheme, developed by Cursive. It combines ideas from a trio of cryptographic primitives: Garbled Circuits, KZG Witness Encryption, and PLONK.

This is a v0 version that has the first end-to-end implementation of the core scheme involving Garbled Circuits & KZG WE. PLONK will be added in a future version; it requires significant refactoring and isn't necessary to build initial applications.

The specific example used is a private hiring matcher. This is the same functionality that we previously built with Multi-Party FHE using [phantom-zone](https://github.com/gausslabs/phantom-zone), which you can find [here](https://github.com/RiverRuby/pz-hiring).

## Acknowledgements

This repo uses code from a number of different projects:

- `/circuits`: [Boolify](https://github.com/voltrevo/boolify) to write a hiring 2PC circuit in Bristol format
- `/jigg`: [JIGG](https://github.com/multiparty/jigg) for JavaScript native Garbled Circuit generation & evaluation
- `/laconic`: [research-we-kzg](https://github.com/rot256/research-we-kzg), the original paper implementation of KZG Witness Encryption
