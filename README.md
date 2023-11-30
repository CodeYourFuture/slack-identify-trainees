# Custom Slack App for the Identify Trainees tender (Work In Progress)

## What is this?
A lot of Slack users don't set certain custom profile fields which show whether they are a trainee or used to be a trainee.
This Slack sends a message to users asking them to set the field when:
- User joins the workspace.
- Every time a user posts in a channel that the app is installed to and their field is not set.

## Architecture
The sequence diagram below shows the series of events and calls.

```mermaid
sequenceDiagram
  actor Trainee
  participant Slack
  participant Netlify
  Trainee->>Slack: Joins workspace
  Slack->>Netlify: POST /slack-app
  Netlify->>Slack: POST /client.chat.postMessage w/ @slack/bolt
  Slack->>Trainee: Message to Trainee
  Trainee->>Slack: Posts message in a channel
  Slack->>Netlify: POST /slack-app
  Netlify->>Slack: GET /client.users.profile.get w/ @slack/bolt
  Note left of Netlify: If custom profile field is blank
  Netlify->>Slack: POST /client.chat.postMessage w/ @slack/bolt
  Slack->>Trainee: Message to Trainee
```

## Tech Stack
- Node.js
- Slack JavaScript SDKs
- Jest
- Netlify

## Deployment
- Will be a Netlify serverless function.