use std::{cell::RefCell, rc::Rc};

use boolify::{generate_bristol, BoolWire, CircuitOutput, IdGenerator, ValueWire};
use bristol_circuit::BristolCircuit;

struct JobCriteria {
    position: ValueWire,
    commitment: ValueWire,
    education: Vec<ValueWire>,
    experience: Vec<ValueWire>,
    interests: Vec<ValueWire>,
    company_stage: Vec<ValueWire>,
    salary: ValueWire,
}

fn generate_job_criteria(prefix: &str, id_gen: &Rc<RefCell<IdGenerator>>) -> JobCriteria {
    JobCriteria {
        position: ValueWire::new_input(&format!("{}_position", prefix), 1, id_gen),
        commitment: ValueWire::new_input(&format!("{}_commitment", prefix), 1, id_gen),
        education: (0..4)
            .map(|i| ValueWire::new_input(&format!("{}_education_{}", prefix, i), 1, id_gen))
            .collect(),
        experience: (0..8)
            .map(|i| ValueWire::new_input(&format!("{}_experience_{}", prefix, i), 1, id_gen))
            .collect(),
        interests: (0..4)
            .map(|i| ValueWire::new_input(&format!("{}_interests_{}", prefix, i), 1, id_gen))
            .collect(),
        company_stage: (0..4)
            .map(|i| ValueWire::new_input(&format!("{}_company_stage_{}", prefix, i), 1, id_gen))
            .collect(),
        salary: ValueWire::new_input(&format!("{}_salary", prefix), 8, id_gen),
    }
}

pub fn hiring() {
    let id_gen = IdGenerator::new_rc_refcell();

    // Generate inputs for both parties using the new structure
    let a = generate_job_criteria("a", &id_gen);
    let b = generate_job_criteria("b", &id_gen);

    // Implement the matching logic
    let compatible_pos = ValueWire::bit_xor(&a.position, &b.position);
    let a_recruiter = a.position.clone();

    // Education match (OR of ANDs)
    let mut education_match = ValueWire::bit_and(&a.education[0], &b.education[0]);
    for i in 1..4 {
        let match_i = ValueWire::bit_and(&a.education[i], &b.education[i]);
        education_match = ValueWire::bit_or(&education_match, &match_i);
    }

    // Experience match
    let mut experience_match = ValueWire::bit_and(&a.experience[0], &b.experience[0]);
    for i in 1..8 {
        let match_i = ValueWire::bit_and(&a.experience[i], &b.experience[i]);
        experience_match = ValueWire::bit_or(&experience_match, &match_i);
    }

    // Salary match
    let salary_match = BoolWire::as_value(&ValueWire::greater_than(&a.salary, &b.salary));

    // Interest overlap
    let mut interest_overlap = ValueWire::bit_and(&a.interests[0], &b.interests[0]);
    for i in 1..4 {
        let match_i = ValueWire::bit_and(&a.interests[i], &b.interests[i]);
        interest_overlap = ValueWire::bit_or(&interest_overlap, &match_i);
    }

    // Company stage overlap
    let mut stage_overlap = ValueWire::bit_and(&a.company_stage[0], &b.company_stage[0]);
    for i in 1..4 {
        let match_i = ValueWire::bit_and(&a.company_stage[i], &b.company_stage[i]);
        stage_overlap = ValueWire::bit_or(&stage_overlap, &match_i);
    }

    // Commitment overlap (!a_commitment | b_commitment)
    let commitment_overlap = ValueWire::bit_or(&ValueWire::bit_not(&a.commitment), &b.commitment);

    // Final result
    let result = [
        &compatible_pos,
        &a_recruiter,
        &education_match,
        &experience_match,
        &salary_match,
        &interest_overlap,
        &stage_overlap,
        &commitment_overlap,
    ]
    .iter()
    .fold(compatible_pos.clone(), |acc, &x| {
        ValueWire::bit_and(&acc, x)
    });

    // Generate circuit
    let outputs = vec![CircuitOutput::new("match_result", result)];
    let bristol_circuit = generate_bristol(&outputs);
    println!("Number of gates: {}", bristol_circuit.gates.len());

    // Write to file
    let output = BristolCircuit::get_bristol_string(&bristol_circuit).unwrap();
    std::fs::write("job_matching.txt", output).unwrap();
}
