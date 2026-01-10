# Ceto Dashboard
This is the tailored admin dashboard for the Ceto app.
This documentation outlines the step-by-step process to create and update the dashboard project.

> ⚠️ **Warning:** This project is currently based on Medusa version 2.12.3.  
> If any modifications are introduced, please update the upgrade checklist accordingly.

## Upgrade Checklist

### Conflict Resolution & Upgrade Steps

When upgrading the dashboard version, follow this conflict resolution checklist:

1. **File Review & Conflict Handling**
   - **`package.json`**: Resolve version conflicts and package management issues.  
   - **`yarn.lock`**: Keep current.  
   - **`README.md`**: Always keep current.  
   - **`index.css`**: Keep current.  
   - **Branding Files**:
     - **Icon/avatar**, **Logo box**, **Avatar box**: Review Ceto branding updates; usually keep current changes.  
   - **Skeleton CSS**: Accept current changes but prioritize incoming updates where needed.  
   - **Main Layout**: Resolve conflicts carefully; requires focus.  
   - **Nav Item**: Resolve conflicts, especially in the `getIsOpen` function.  
   - **User Menu**: Remove unnecessary Medusa links; resolve conflicts.  
   - **`client.ts` (lib)**: Accept current changes for `authType` and `jwtToken`.  
   - **New Home Page**: Accept current changes.  
   - **Translations Schema & Files**:  
     - Add home page translations and accept all incoming changes.  
     - Preferably resolve conflicts related to field renaming from **Medusa → Ceto**.  

2. **Post-Conflict Replacement**
   - Replace all remaining references of **“Medusa”** with **“Ceto”** using the following order:
     1. Search for `"medusa"` in JSON files (translations) → update to `"ceto"`.  
     2. Search for `,medusa` in product import templates → update to `,ceto`.  
     3. Double-check `.ts` files for any missed occurrences.  

3. **Translation Cleanup**
   - Remove extra languages by deleting unused translations JSON files.  
   - Update `index.ts` and `languages.ts`.  
   - Ensure **Arabic** translations are set to **LTR**.  

4. **Pre-Build Safety**
   - Run all **Build Tooling Injection** commands before proceeding to ensure dependencies are correct.  

5. **Verification**
   - Locally host the Medusa backend with database and run the dashboard.  
   - Confirm all functionalities work as expected.  
   - Run the dashboard build.  

6. **Final Steps**
   - If build succeeds:  
     - Verify `package.json` and `yarn.lock`.  
     - Apply necessary version bumps.  
     - Push to new release. 

## Important Dependency Configuration
* [ ] **Path Audit:** Update `package.json` to ensure module paths are correct for a standalone setup (removing monorepo workspace references from node_modules calls).

## Build Tooling Injection
Install Vite and the necessary styling processors.

| Tool | Command |
| :--- | :--- |
| **Vite Stack** | `yarn add -D vite @vitejs/plugin-react vite-plugin-inspect` |
| **Styling** | `yarn add -D tailwindcss@3.4.1 autoprefixer@10.4.17 postcss@8.4.33` |
| **TypeScript** | `yarn add --dev @types/node @types/react` |
| **Build** | `yarn add -D tsup typescript` |

---

## 💡 Best Practices
* **Version Matching:** Always pin Tailwind and PostCSS versions to those used in the specific Medusa release.
* **Isolation:** Use unique directories for different dashboard versions to avoid dependency conflicts.

---
