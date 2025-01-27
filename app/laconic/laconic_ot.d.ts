/* tslint:disable */
/* eslint-disable */
/**
*/
export function start(): void;
/**
*/
export class WasmCommitmentKey {
  free(): void;
/**
* @param {number} message_length
* @returns {WasmCommitmentKey}
*/
  static setup(message_length: number): WasmCommitmentKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {WasmCommitmentKey}
*/
  static deserialize(data: Uint8Array): WasmCommitmentKey;
}
/**
*/
export class WasmMessage {
  free(): void;
}
/**
*/
export class WasmReceiver {
  free(): void;
/**
* @param {WasmCommitmentKey} ck
* @param {Uint8Array} bits
* @returns {WasmReceiver}
*/
  static new(ck: WasmCommitmentKey, bits: Uint8Array): WasmReceiver;
/**
* @param {number} i
* @param {WasmMessage} msg
* @returns {Uint8Array}
*/
  recv(i: number, msg: WasmMessage): Uint8Array;
/**
* @returns {Uint8Array}
*/
  commitment(): Uint8Array;
/**
* @param {Uint8Array} data
* @param {WasmCommitmentKey} ck
* @returns {WasmReceiver}
*/
  static deserialize(data: Uint8Array, ck: WasmCommitmentKey): WasmReceiver;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class WasmSender {
  free(): void;
/**
* @param {WasmCommitmentKey} ck
* @param {Uint8Array} commitment_bytes
* @returns {WasmSender}
*/
  static new(ck: WasmCommitmentKey, commitment_bytes: Uint8Array): WasmSender;
/**
* @param {number} i
* @param {Uint8Array} m0
* @param {Uint8Array} m1
* @returns {WasmMessage}
*/
  send(i: number, m0: Uint8Array, m1: Uint8Array): WasmMessage;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmcommitmentkey_free: (a: number, b: number) => void;
  readonly __wbg_wasmreceiver_free: (a: number, b: number) => void;
  readonly __wbg_wasmsender_free: (a: number, b: number) => void;
  readonly __wbg_wasmmessage_free: (a: number, b: number) => void;
  readonly wasmcommitmentkey_setup: (a: number, b: number) => void;
  readonly wasmcommitmentkey_serialize: (a: number, b: number) => void;
  readonly wasmcommitmentkey_deserialize: (a: number, b: number, c: number) => void;
  readonly wasmreceiver_new: (a: number, b: number, c: number) => number;
  readonly wasmreceiver_recv: (a: number, b: number, c: number, d: number) => void;
  readonly wasmreceiver_commitment: (a: number, b: number) => void;
  readonly wasmreceiver_deserialize: (a: number, b: number, c: number) => number;
  readonly wasmreceiver_serialize: (a: number, b: number) => void;
  readonly wasmsender_new: (a: number, b: number, c: number, d: number) => void;
  readonly wasmsender_send: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly start: () => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
