#!/usr/bin/env bash
set -euo pipefail

RELEASE_REPO="${OPENCODE_RELEASE_REPO:-RhoninSeiei/opencode}"
DEFAULT_BRANCH="${OPENCODE_DEFAULT_BRANCH:-dev}"
INSTALLER_URL="${OPENCODE_INSTALLER_URL:-https://raw.githubusercontent.com/${RELEASE_REPO}/${DEFAULT_BRANCH}/install-fork.sh}"
INSTALL_SOURCE_URL="${OPENCODE_INSTALL_SOURCE_URL:-https://raw.githubusercontent.com/${RELEASE_REPO}/${DEFAULT_BRANCH}/install}"

if [ -n "${BASH_SOURCE[0]:-}" ]; then
    SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
else
    SCRIPT_DIR=""
fi

if [ -n "$SCRIPT_DIR" ] && [ -f "${SCRIPT_DIR}/install" ]; then
    OPENCODE_RELEASE_REPO="$RELEASE_REPO" \
    OPENCODE_INSTALLER_URL="$INSTALLER_URL" \
    bash "${SCRIPT_DIR}/install" "$@"
    exit $?
fi

TMP_FILE="$(mktemp)"
cleanup() {
    rm -f "$TMP_FILE"
}
trap cleanup EXIT

curl -fsSL "$INSTALL_SOURCE_URL" -o "$TMP_FILE"
OPENCODE_RELEASE_REPO="$RELEASE_REPO" \
OPENCODE_INSTALLER_URL="$INSTALLER_URL" \
bash "$TMP_FILE" "$@"
