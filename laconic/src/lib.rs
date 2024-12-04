mod kzg;
mod kzg_fk_open;
mod kzg_types;
mod kzg_utils;
mod laconic_ot;
mod wasm_bindings;

pub use kzg_types::CommitmentKey;
pub use laconic_ot::*;
pub use wasm_bindings::*;

// Initialize panic hook for better error messages in WASM
#[wasm_bindgen::prelude::wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}
