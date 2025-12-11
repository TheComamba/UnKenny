# Contributing to UnKenny

Thank you for your interest in contributing! The guidelines below outline how to get started and how to ensure that contributions integrate smoothly.

## Getting Started

Before making changes, it’s helpful to familiarize yourself with:
- The project’s overall purpose and structure.
- Existing issues and discussions.
- The development workflow used in this repository.

## Code Contributions

If you want to add or modify code:
1.	Fork the repository.
2.	Create a new branch for your work.
3.	Write your changes along with tests.
4.	Run the full test suite before opening a PR.
5.	Submit a pull request with a clear explanation of what you changed and why.

Pull requests should be focused: small and cohesive changes are easier to review and merge.

## The Role of Tests

Tests are a central part of this project’s development approach. Every new feature, fix, or refactor must include appropriate test coverage. Foundry sometimes behaves in wholly unexpected ways, making UnKenny a rather fickle project. Only tests ensure that the code stays reliable as the project evolves and helps future contributors understand intended behavior.

### High-Level Overview of the Testing Approach
- The project uses a structured test suite designed to validate individual components and end-to-end behavior.
- Unit tests verify that small pieces of logic behave as intended.
- Integration tests check how these pieces work together across the larger system.
- Run tests locally with "scripts/test.sh" or "scripts\test.ps1". Add the "-a" flag to include tests that make calls to the OpenAI API.
- Tests run automatically through the repository’s CI pipeline to catch issues early.

If you’re unfamiliar with the project’s test layout, take a quick look inside the tests/ directory. The structure is designed to be readable and intuitive. When in doubt, mirror the style and patterns found in existing tests.

## Community & Collaboration

Constructive communication keeps the project healthy. Please engage respectfully in issues, reviews, and discussions.

## License

By contributing, you agree that your contributions will be licensed under the project’s existing license terms.