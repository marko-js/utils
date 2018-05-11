<h1 align="center">
  <!-- Logo -->
  🔨 Utils 🔧
  <br/>

  <!-- Structure -->

  <a href="https://github.com/lerna/lerna">
    <img src="https://img.shields.io/badge/monorepo-lerna-531099.svg" alt="Lerna"/>
  </a>
  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- License -->
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/marko-js/utils.svg" alt="MIT"/>
  </a>
  <!-- CI -->
  <a href="https://travis-ci.org/marko-js/utils">
    <img src="https://img.shields.io/travis/marko-js/utils.svg" alt="Build status"/>
  </a>
  <!-- Coverage -->
  <a href="https://coveralls.io/github/marko-js/utils">
    <img src="https://img.shields.io/coveralls/marko-js/utils.svg" alt="Test Coverage"/>
  </a>
  <!-- It's a joke -->
  <a href="https://twitter.com/mlrawlings/status/974823927917641728">
    <img src="https://img.shields.io/badge/🐛-Bug Free-green.svg" alt="It's a joke"/>
  </a>
</h1>

## Contributing

This repo provides a consistent build, test, & development environment around small utilities that are shared by packages used in many of the projects in the Marko ecosystem.

### [npm](https://twitter.com/chriscoyier/status/896051713378992130) scripts

* `test` Run the tests for all packages
* `publish` Runs build and begins publishing any changed packages
* `build` Runs babel on the `src` folder for every package _(runs on publish)_
* `format` Formats the files in the repo _(runs on precommit)_
* `lint` Lints the files in the repo _(runs on precommit)_

## Code of Conduct

This project adheres to the [eBay Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
