
import { buildScriptEnsuringTidalIsRunning, runAppleScriptSilently, sendSystemEventToTidal } from "./helpers/applescript";

export default async () => {
  const command = sendSystemEventToTidal("click menu item \"Volume up\" of menu \"Playback\" of menu bar 1")
  const script = buildScriptEnsuringTidalIsRunning(command);
  await runAppleScriptSilently(script);
};