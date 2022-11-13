![](static/logo.svg)

# Caterpillar 🐛

A clean frontend for Parasite - Built with Fresh.

## Usage

### Setting up

Edit `settings.ts`:

```
// General settings for the frontend go here.
export const caterpillarSettings = {
  "siteName": "Parasite Instance",
  "apiURL": "http://localhost:8080",
};
```

Make sure these match:

1. `siteName`, and
2. `sitePort` in Parasite's `settings.ts`.

### Running

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Documentation

All of these routes present in the default Parasite API work the same in
Caterpillar:

> `/t/[id]` - Retrive torrent.

> `/u/[id]` - Retrive torrent.

> `/i/[id]` - Get list of tagged items

> `/s` - Search

> `/u/[id]/` - Get user profile
>
> - `followers` - Accounts that follow user
> - `following` - Accounts user is following
> - `likes` - User likes
> - `outbox` - Posts by user

> `/login` - Login to an account

> `/register` - Register an account

> `/a/` - Admin routes
>
> - `delete` - Delete posts
> - `federate` - Pool/Block instances
> - `roles` - Modify user roles

For uploading, updating, and some other methods, things get a little different:

> `upload/`
>
> - `torrent` - Upload Torrent
> - `list` - Upload list

> `update/`
>
> - `t/[id]` - Update torrent
> - `l/[id]` - Update list

> `/logout` - Clear data of currently logged in user

That is all. Settings can be modified in `settings.ts`.

## License

0BSD
