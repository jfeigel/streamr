export interface Player {
  _options: {
    getOAuthToken: Function,
    id: string,
    name: string
  };
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event_name: string, callback: Function): boolean;
  removeListener(event_name: string, callback?: Function): boolean;
  pause(): Promise<void>;
  resume(): Promise<void>;
  togglePlay(): Promise<void>;
}
