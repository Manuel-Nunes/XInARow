#!/bin/bash

# Prompt for the commit message
read -p "Enter the commit message: " commit_message

# Stage all changes
git add .

# Commit changes with the provided commit message
git commit -m "$commit_message"

# Push the changes to the remote repository
git push origin

echo "Changes committed and pushed successfully."