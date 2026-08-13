#!/bin/bash

# Manifest paths are resolved from this script's own location rather than the
# working directory. Tilt's Pull button runs it from dev/, a person running it
# by hand is as likely to be at the repo root.
MANIFESTS="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/manifests"

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq to use this script."
    exit 1
fi

fetch_latest_tag() {
    local repo=$1
    local url="https://api.github.com/repos/${repo}/releases/latest"
    curl -s "$url" | jq -r '.tag_name' | sed 's/^v//'
}

update_tag() {
    local file=$1
    local prefix=$2
    local tag=$3

    if [[ -f "$file" ]]; then
        sed -i.bak "s|${prefix}[0-9.]\+|${prefix}${tag}|" "$file" && rm "${file}.bak"
        echo "Using tag '$tag' for $file"
    else
        echo "Error: File $file not found."
        exit 1
    fi
}

echo "Server"
echo ""

# migration hasn't been ported to the virtool-ui monorepo yet, so it still
# versions off the virtool python monolith's releases.
virtool_tag=$(fetch_latest_tag "virtool/virtool")
update_tag "$MANIFESTS/migration.yaml" "ghcr.io/virtool/virtool:" "$virtool_tag"

# web, jobs-api, tasks, and all four workflows now build from virtool-ui, so
# one release tag covers all of them.
ui_tag=$(fetch_latest_tag "virtool/virtool-ui")
update_tag "$MANIFESTS/web/kustomization.yaml" "newTag: " "$ui_tag"
update_tag "$MANIFESTS/virtool/jobs-api/kustomization.yaml" "newTag: " "$ui_tag"
update_tag "$MANIFESTS/virtool/tasks/kustomization.yaml" "newTag: " "$ui_tag"

echo ""
echo "Workflows"
echo ""

for workflow in "create-sample" "create-subtraction" "nuvs" "pathoscope"; do
    update_tag "$MANIFESTS/workflows/${workflow}.yaml" "${workflow}:" "$ui_tag"
done
