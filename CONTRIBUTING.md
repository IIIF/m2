This document serves as a reference for the Mirador community and others interested in the project. It aims to outline agreed-upon practices that are used in the development and maintenance of the Mirador software.


## Contributing to Mirador

Contributions to Mirador are always welcome!

It is always helpful to begin any large change by submitting an issue or engaging with the Mirador community. Mirador 3.0 and beyond adheres to [semantic versioning](https://semver.org/) so that adopters and contributors can better understand what changes can be expected in released versions of the software.

All contributions should be submitted as a [GitHub pull request](https://help.github.com/articles/about-pull-requests/) to the main branch. Pull requests must be reviewed and accepted by another Mirador maintainer and pass all continuous integration checks. Contributions should have tests for the feature or bug fix, documentation, should maintain high code coverage, and should conform to the Mirador agreed-upon coding style. Contributions should not include a “built” version of Mirador—this will help to reduce merge conflicts.

### Code of Conduct
Everyone interacting in this community is expected to follow the [Mirador Code of Conduct](https://github.com/ProjectMirador/mirador/blob/main/CODE_OF_CONDUCT.md).

### Accessibility
Mirador aims to comply with the [Web Content Accessibility Guidelines (WCAG) 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/). These guidelines, authored by the W3C and legally adopted [internationally](https://www.w3.org/WAI/policies/?q=wcag-20), are comprehensive and provide the success criteria designers and developers need to build accessible web applications.

Mirador’s documentation wiki offers [additional information, tools, and resources](https://github.com/ProjectMirador/mirador/wiki/M3-Accessibility-Guidelines-for-Contributors) for testing your contributions against accessibility criteria before submitting pull requests.

### Adding dependencies
Careful consideration should be given when adding software dependencies to Mirador. During the code review process, new dependencies may be evaluated on the following considerations:

-   added size of the dependency
-   whether or not that dependency is maintained and tested
-   how the dependency may interact with Mirador embedded in other environments
    
As a general rule, dependencies added should not be committed directly, but should instead use a package manager to require the dependency.

Dependencies should also be scoped (both for style and script) so that they do not interact with a containing application.

### Coding style
Mirador has adopted the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as its agreed-upon coding style for all contributions. This helps us ensure a consistent codebase with higher readability.

### Testing
Mirador should be well-tested at several different levels. A component or class should be tested individually (unit tests) and the interaction of that component or class with other parts should also be tested (integration tests).

### Documentation
Added or modified code should be appropriately documented using JSDoc comments and established project conventions.

### Plugin architecture
Mirador 3 shifted to a plugin architecture to better support the wide array of uses of Mirador. This allows for the design to accommodate plugins in a more focused way. It also allows the community to maintain the core components while giving developers the freedom to develop new and innovative plugins. Your contribution might fit nicely as a Mirador plugin. For more on plugins, please see [Mirador 4 Plugins](https://github.com/ProjectMirador/mirador/wiki/Creating-a-Mirador-4-Plugin) and [Mirador 3 Plugins](https://github.com/ProjectMirador/mirador/wiki/Mirador-3-plugins) in the wiki.

### Support
If you have questions, please check the [wiki](https://github.com/ProjectMirador/mirador/wiki), add a [discussion](https://github.com/ProjectMirador/mirador/discussions) question, post on the #mirador channel of the [IIIF Slack workspace](http://iiif.slack.com/), or join a Mirador community call (see #mirador for call details). Slack and community calls are also both great places to meet users and maintainers.

### Plugin architecture
Mirador 3 shifted to a plugin architecture to better support the wide array of uses of Mirador. This remains the architecture in Mirador 4. This allows for the design to accommodate plugins in more focused way. It also allows the community to maintain the core components while giving developers the freedom to develop new and innovative plugins. Your contribution might fit nicely as a Mirador plugin.
