# Running the application at startup

You can run configure your operating system to immediately run front-end (`/react`) after booting.

## Table of contents

- [Running the application at startup](#running-the-application-at-startup)
  - [Table of contents](#table-of-contents)
  - [Build the project](#build-the-project)
  - [Start the Electron application](#start-the-electron-application)
  - [Set up the startup script](#set-up-the-startup-script)
    - [MacOS (any version that includes Automator)](#macos-any-version-that-includes-automator)

## Build the project

To build to project, you will need to navigate to the `/react` directory and run the following command:

    bun run build

This will transform all Tailwind and JSX, and convert it to a static HTML file (located in `./dist`)

## Start the Electron application

For running the website as a standalone application, we use [Electron](https://www.electronjs.org/). After building, you can start the application by running the following command:

**_⚠️ Note: this won't work in WSL! Make sure to clone the project on your native Windows partition, instead of your Linux partition._**

    bun run start

_Please verify that this command starts the application before adding any startup scripts._

## Set up the startup script

On most major operating systems, there are ways to run a Bash script at startup.

---

#### MacOS (any version that includes Automator)

1. Launch Automator.

2. If a Finder window appears, click on _'New Document'_.

3. Select _'Application'_.

4. Add _'Run shell script'_ by double-clicking or dragging it into the window on the right side.

5. Copy-and-paste the contents of `./react/startup_script.sh` into the window.

6. Replace the directory on the first line with the directory to the repo, for example:

   ```bash
   cd ~/coding/happy-herbivore/react
   npm run start
   ```

7. Test it by clicking on _'Run'_ (top-right corner). The app should launch.

8. Save it somewhere (`cmd+s`). A file called <your_name>.app will becreated at the selected location.

9. Go to System Preferences → General → Login items & Extensions.

10. Add the new app
