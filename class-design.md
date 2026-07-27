# User and Property Class Design

## User

### Responsibility

The User class represents a registered user of the property application.
It stores account information and manages actions that belong directly
to the user, such as saving and removing properties.

The User class is not responsible for authentication, rendering UI,
sending emails, or saving data to files.

### Attributes

- id: uniquely identifies the user
- name: the user's display name
- email: the user's email address
- passwordHash: the hashed password for credentials-based accounts
- savedPropertyIds: the IDs of properties saved by the user
- createdAt: the date the account was created

### Methods

- changeName
- changeEmail
- changePasswordHash
- saveProperty
- removeSavedProperty
- hasSavedProperty

### Authentication design decision

Google users and credentials users will both be represented by the same
User class because they are both users of the same application.

The passwordHash property will be optional because:

- credentials users require a stored password hash
- Google users authenticate through Google and therefore do not need a local password

### Authentication provider

The User class stores which authentication provider was used to create
the account.

The supported providers are:

- credentials
- google

This allows the application to distinguish between users who authenticate
with a local password and users who authenticate through Google.

The passwordHash property remains optional because only credentials users
require a locally stored password hash.