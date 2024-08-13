import { closeMainWindow, getApplications, showHUD } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";

/**
 * Builds AppleScript to ensure Tidal is running and then wraps the passed command(s).
 *
 * @param commandsToRunAfterTidalIsRunning - The AppleScript command(s) to run after ensuring Tidal is running.
 * @returns Generated AppleScript.
 */
export function buildScriptEnsuringTidalIsRunning(commandsToRunAfterTidalIsRunning: string): string {
  return `
    tell application "TIDAL"
      if not application "TIDAL" is running then
        activate

        set _maxOpenWaitTimeInSeconds to 5
        set _openCounter to 1
        repeat until application "TIDAL" is running
          delay 1
          set _openCounter to _openCounter + 1
          if _openCounter > _maxOpenWaitTimeInSeconds then exit repeat
        end repeat
      end if
    end tell
    ${commandsToRunAfterTidalIsRunning}
  `;
}

/**
 * Generates the AppleScript to send a system event to Tidal
 * 
 * @param eventCommand Event to send to Tidal
 * @returns Generated AppleScript
 */
export function sendSystemEventToTidal(eventCommand: string): string {
  return `
    tell application "System Events"
      tell process "TIDAL"
        ${eventCommand}
      end tell
    end tell
  `
}

/**
 * Runs the AppleScript and closes the main window afterwards.
 *
 * @remarks
 * The main window is before running the AppleScript to keep the UI snappy.
 *
 * @param appleScript - The AppleScript to run
 * @throws An error when the AppleScript fails to run
 * @returns A promise that is resolved when the AppleScript finished running
 */
export async function runAppleScriptSilently(appleScript: string) {
  await closeMainWindow();

  const applications = await getApplications();
  const isTidalInstalled = applications.some((app) => app.name === "TIDAL");
  if (!isTidalInstalled) {
    await showHUD("Tidal is not installed");
    return;
  }

  await runAppleScript(appleScript);
}