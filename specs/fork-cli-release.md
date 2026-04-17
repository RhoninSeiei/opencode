# Fork CLI Release Notes

This fork ships Linux CLI binaries from GitHub Releases in `RhoninSeiei/opencode`.

## Installer

Use the fork installer:

```bash
curl -fsSL https://raw.githubusercontent.com/RhoninSeiei/opencode/dev/install-fork.sh | bash
```

Install a specific release:

```bash
curl -fsSL https://raw.githubusercontent.com/RhoninSeiei/opencode/dev/install-fork.sh | bash -s -- --version 1.0.180-rhonin.1
```

## Manual Ubuntu install

```bash
VER=v1.0.180-rhonin.1
ASSET=opencode-linux-x64.tar.gz

curl -L -o /tmp/$ASSET \
  https://github.com/RhoninSeiei/opencode/releases/download/$VER/$ASSET

tar -xzf /tmp/$ASSET -C /tmp

mkdir -p "$HOME/.local/bin"
install -m 0755 /tmp/opencode "$HOME/.local/bin/opencode"
```

## Workflow

Run the `fork-release-cli` workflow with a version string such as `1.0.180-rhonin.1`. The workflow creates or updates a GitHub Release, builds CLI archives, and uploads `checksums.txt` together with `install-fork.sh`.

## Provider note

The compiled binary includes provider integrations such as `@ai-sdk/vercel`. Ubuntu hosts do not need a Vercel deployment to run the CLI. Vercel credentials are only needed when selecting the Vercel provider at runtime.
