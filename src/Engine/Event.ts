type SignalCallback<T> = (data: T) => void;

export class Signal<T> {
  private listeners: SignalCallback<T>[] = [];

  subscribe(callback: SignalCallback<T>): void {
    if (this.listeners.indexOf(callback) != -1) return;
    this.listeners.push(callback);
  }

  unsubscribe(callback: SignalCallback<T>): void {
    this.listeners = this.listeners.filter((listener) => listener != callback);
  }

  trigger(data: T): void {
    this.listeners.forEach((listener) => listener(data));
  }
}
