# md-notes-cli
Simple CLI for quick notes

## Requirements
1. Node installed (run `node -v` to check)

## Install
1. `git clone https://github.com/vladyslav-kyrpa/md-notes-cli.git`
2. `cd md-notes-cli`
3. `npm install`
4. `npm link` (link globally so you can be used from anywhere)

## Usage
1. Config path to notes storage directory
`note --path <dir>`
2. Create a new note
`note -n <title> -m <content>`
3. Create a note without a name (only timestamp)
`note -m <content>`
