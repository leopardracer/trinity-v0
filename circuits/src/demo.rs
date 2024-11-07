use boolify::{generate_bristol, BoolWire, CircuitOutput, IdGenerator, ValueWire};
use bristol_circuit::BristolCircuit;

pub fn demo() {
    let id_gen = IdGenerator::new_rc_refcell();

    let a = ValueWire::new_input("a", 8, &id_gen);
    let b = ValueWire::new_input("b", 8, &id_gen);
    let c = ValueWire::mul(&a, &b);
    let d = ValueWire::less_than(&c, &ValueWire::new_const(123, &id_gen));
    let outputs = vec![CircuitOutput::new("d", BoolWire::as_value(&d))];

    let bristol_circuit = generate_bristol(&outputs);
    println!("gates: {}", bristol_circuit.gates.len());
    let output = BristolCircuit::get_bristol_string(&bristol_circuit).unwrap();
    std::fs::write("demo.txt", output).unwrap();
}
