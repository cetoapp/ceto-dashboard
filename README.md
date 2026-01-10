# Ceto Dashboard Setup Guide
This is the tailored admin dashboard for the Ceto app.
This documentation outlines the step-by-step process to create and update the dashboard project.

## 📋 Process Checklist

### 1. Repository Preparation
* [ ] **Clone Source:** `git clone <medusa-repo-url> temp`
* [ ] **Select Version:** `git checkout <release-tag>`
* [ ] **Extract:** Copy the `dashboard` folder out of the repository.
* [ ] **Cleanup:** Remove the `temp` folder.

### 2. Dependency Configuration
* [ ] **Initial Install:** Run `yarn install`.
* [ ] **Path Audit:** Update `package.json` to ensure module paths are correct for a standalone setup (removing monorepo workspace references from node_modules calls).

### 3. Build Tooling Injection
Install Vite and the necessary styling processors.

| Tool | Command |
| :--- | :--- |
| **Vite Stack** | `yarn add -D vite @vitejs/plugin-react vite-plugin-inspect` |
| **Styling** | `yarn add -D tailwindcss@3.4.1 autoprefixer@10.4.17 postcss@8.4.33` |
| **TypeScript** | `yarn add --dev @types/node @types/react` |

---

## 💡 Best Practices
* **Version Matching:** Always pin Tailwind and PostCSS versions to those used in the specific Medusa release.
* **Isolation:** Use unique directories for different dashboard versions to avoid dependency conflicts.

---

## 🤖 Automation Script (`update-dashboard.sh`)

```bash
#!/bin/bash

# Configuration
REPO_URL="<medusa-repo-url>"
TAG="<release-tag>"
TARGET_DIR="dashboard"

# Extraction
git clone $REPO_URL temp
cd temp
git checkout $TAG
cp -r packages/admin/dashboard ../$TARGET_DIR
cd ..
rm -rf temp

# Setup
cd $TARGET_DIR
yarn install
yarn add -D vite @vitejs/plugin-react vite-plugin-inspect
yarn add -D tailwindcss@3.4.1 autoprefixer@10.4.17 postcss@8.4.33
yarn add --dev @types/node @types/react

echo "Setup Complete."
