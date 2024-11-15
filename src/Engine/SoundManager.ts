import { None, Option, Some } from "./ReturnTypes";

export class SoundManager {
  private context: AudioContext;

  private sounds: { [key: string]: HTMLAudioElement } = {};
  private tracks: MediaElementAudioSourceNode[] = [];

  constructor() {
    this.context = new AudioContext();
  }

  addSound(name: string, source: string) {
    let newAudioSource = new Audio(source);
    let newTrack = this.context.createMediaElementSource(newAudioSource);
    newTrack.connect(this.context.destination);

    this.sounds[name] = newAudioSource;
    this.tracks.push(newTrack);
  }

  getSound(name: string): Option<HTMLAudioElement> {
    let sound = this.sounds[name];
    if (sound == null) return None();
    return Some(sound);
  }

  playSound(name: string) {
    let soundOption = this.getSound(name);
    if (!soundOption.isSome) return;
    let sound = soundOption.value;

    if (this.context.state == "suspended") this.context.resume();
    sound.play();
  }

  pauseSound(name: string) {
    let soundOption = this.getSound(name);
    if (!soundOption.isSome) return;
    let sound = soundOption.value;

    sound.pause();
  }

  stopSound(name: string) {
    let soundOption = this.getSound(name);
    if (!soundOption.isSome) return;
    let sound = soundOption.value;

    this.pauseSound(name);
    sound.currentTime = 0;
  }
}
