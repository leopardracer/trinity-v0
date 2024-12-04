use ark_bls12_381::{Bls12_381, Fr};
use ark_ec::pairing::Pairing;
use ark_poly::Radix2EvaluationDomain;
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use rand::{thread_rng, Rng};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

use crate::{CommitmentKey, LaconicOTRecv, LaconicOTSender, Msg, MSG_SIZE};

type Domain = Radix2EvaluationDomain<Fr>;
type E = Bls12_381;

// Wrapper types for WASM
#[wasm_bindgen]
#[derive(Clone)]
pub struct WasmCommitmentKey {
    commitment_key: CommitmentKey<E, Domain>,
}

#[wasm_bindgen]
pub struct WasmReceiver {
    receiver: LaconicOTRecv<'static, E, Domain>,
}

#[wasm_bindgen]
pub struct WasmSender {
    sender: LaconicOTSender<'static, E, Domain>,
}

#[wasm_bindgen]
pub struct WasmMessage {
    message: Msg<E>,
}

// CommitmentKey implementations
#[wasm_bindgen]
impl WasmCommitmentKey {
    #[wasm_bindgen]
    pub fn setup(message_length: usize) -> Result<WasmCommitmentKey, JsValue> {
        let mut rng = rand::thread_rng();

        CommitmentKey::<E, Domain>::setup(&mut rng, message_length)
            .map(|key| WasmCommitmentKey {
                commitment_key: key,
            })
            .map_err(|_| JsError::new("Failed to setup commitment key").into())
    }
}

// Receiver implementations
#[wasm_bindgen]
impl WasmReceiver {
    #[wasm_bindgen]
    pub fn new(ck: &WasmCommitmentKey, bits: Vec<u8>) -> Self {
        let key = Box::leak(Box::new(ck.commitment_key.clone()));
        let bits: Vec<bool> = bits.into_iter().map(|b| b != 0).collect();
        WasmReceiver {
            receiver: LaconicOTRecv::new(key, &bits),
        }
    }

    #[wasm_bindgen]
    pub fn recv(&self, i: usize, msg: &WasmMessage) -> Vec<u8> {
        self.receiver.recv(i, msg.message.clone()).to_vec()
    }

    #[wasm_bindgen]
    pub fn commitment(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        self.receiver
            .commitment()
            .serialize_uncompressed(&mut bytes)
            .unwrap();
        bytes
    }

    #[wasm_bindgen]
    pub fn deserialize(data: &[u8], ck: &WasmCommitmentKey) -> Self {
        let key = Box::leak(Box::new(ck.commitment_key.clone()));
        WasmReceiver {
            receiver: LaconicOTRecv::deserialize(data, key),
        }
    }

    #[wasm_bindgen]
    pub fn serialize(&self) -> Vec<u8> {
        self.receiver.serialize()
    }
}

// Sender implementations
#[wasm_bindgen]
impl WasmSender {
    #[wasm_bindgen]
    pub fn new(ck: &WasmCommitmentKey, commitment_bytes: &[u8]) -> Result<WasmSender, JsValue> {
        let commitment = <E as Pairing>::G1::deserialize_uncompressed(commitment_bytes)
            .map_err(|_| JsError::new("Failed to deserialize commitment"))?;
        let key = Box::leak(Box::new(ck.commitment_key.clone()));
        Ok(WasmSender {
            sender: LaconicOTSender::new(key, commitment),
        })
    }

    #[wasm_bindgen]
    pub fn send(&self, i: usize, m0: &[u8], m1: &[u8]) -> Result<WasmMessage, JsValue> {
        let mut rng = rand::thread_rng();

        let m0_array: [u8; MSG_SIZE] = m0
            .try_into()
            .map_err(|_| JsError::new(&format!("m0 must be {} bytes", MSG_SIZE)))?;
        let m1_array: [u8; MSG_SIZE] = m1
            .try_into()
            .map_err(|_| JsError::new(&format!("m1 must be {} bytes", MSG_SIZE)))?;

        let msg = self.sender.send(&mut rng, i, m0_array, m1_array);
        Ok(WasmMessage { message: msg })
    }
}
