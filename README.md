# Hello there!

The goal of this exercise is to extend this "Github Repo Search" application. The application currently lists the projects of the Netflix Github organization by fetching from Github's REST API:

https://docs.github.com/en/rest/reference/repos

## Feature requests

Please implement the following features.

1. **Ability to view the repos of any Github Organization (eg. Netflix)** The user should be able to choose which organization is being listed.
1. **Include a subset of the returned repo data that you feel is meaningful to your user, and present it in a simple and usable way** Please document your choice at the end of this README
1. **Ability to view an individual repo's recent commits**
1. **Display results such that they are easy to read and parse**
1. **Create shareable urls for the results of listing the repos of an organization** ie. a url that can be shared so another user could view an organization's repos
1. **Any other enhancements you feel would make for a more compelling product** Please timebox this appropriately. See the "Time estimate" section below

We've purposefully left the details open to your own interpretation, so feel free to get creative with your solution.

## Developing locally

Run `yarn` and `yarn start` to start developing locally.

## Time estimate

Our expectation is that this exercise can be completed in about 2 hours. Please prioritize your efforts to be close to this constraint. If you have other enhancements and creative ideas you want to showcase and if they will take you over this time constraint, please use the "Your README" section at the end to describe your ideas rather than implementing them.

## Documentation

Please document your submission at the end (separate section is provided at the bottom). In your documentation, please provide the following:

- The approach you've taken with your solution, calling out any decisions / tradeoffs you made or interesting areas of code
- The next steps you would take to improve upon your solution
- The total time you spent on the exercise

## Submitting your solution

Please send us a zip file when you are ready as per the instructions in the associated email message.

## Your README

### Decisions

I decided to collect summary data that felt useful to a user looking up a list of repositories, in general, what I would expect to find if I was looking for a repository. This included a link to the repository itself, the date it was created, the open issues, forks, and stars, and links to those pages, and a description of the repository. I tried to follow this same convention for the commit summaries.

I composed this data via HTML in a way that I felt would be easy to style, with the right amount of time for development given.

I used React Context to handle the organization selection to avoid any prop drilling. Because this is a small application, with only one "global" state, there's no need to consider what unintended side effects could occur from removing or changing it. There isn't much of a trade-off here because it's the main function of the application, and can be changed in only one place. If the application got more complicated, this may be worth reconsidering.

I used BEM, and kept all of the styles in one stylesheet. I typically prefer a modularized approached (such as CSSmodules), but because of the limit of two hours of time, I felt it would be easier with the small number of elements in this exercise to practice good class naming and keep it in one stylesheet. For large applications, this is typically untenable, as it becomes difficult to update existing styles in a large stylesheet, and to continue complex naming conventions. 

For the shareable URLs, I opted to go with an easy history API manipulation and avoiding dealing with any true routing or query params. While doing something more complicated would certainly be useful and scalable, for the purpose of this exercise, the time spent to do something more complex would do little to show capability beyond what has already been shared.

### Next Steps

I would have loved to implement a fuzzy search/autocomplete.

I think pagination would make this application a much better user experience, both in the repo list and in the list of recent commits when there are 10+.

Consider only allowing one repository's commits to display at a time. Consider trade-offs such as amount of DOM displayed on the page vs any possible user considerations for why we may want to leave it up to the user to keep multiple open.

I would love to spend more time around better styles. I didn't have a ton of time left once I implemented all of the features, and while it's not horrible to look at, it could be a lot better.

### Time Spent

2 Hours (20 minutes timeboxed to styling, 15 minutes documenting decisions and next steps)