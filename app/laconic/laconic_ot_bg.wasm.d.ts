/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function start(): void;
export function __wbg_wasmcommitmentkey_free(a: number, b: number): void;
export function __wbg_wasmreceiver_free(a: number, b: number): void;
export function __wbg_wasmsender_free(a: number, b: number): void;
export function __wbg_wasmmessage_free(a: number, b: number): void;
export function wasmcommitmentkey_setup(a: number, b: number): void;
export function wasmreceiver_new(a: number, b: number, c: number): number;
export function wasmreceiver_recv(a: number, b: number, c: number, d: number): void;
export function wasmreceiver_commitment(a: number, b: number): void;
export function wasmreceiver_deserialize(a: number, b: number, c: number): number;
export function wasmreceiver_serialize(a: number, b: number): void;
export function wasmsender_new(a: number, b: number, c: number, d: number): void;
export function wasmsender_send(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export function __wbindgen_exn_store(a: number): void;
export function __wbindgen_start(): void;
