/**
 * Simplified JIGG agent for garbling and evaluation
 */
"use strict";

const LABEL_SIZE = 16; // 16 bytes => 128 bits

const garble = require("./garble.js");
const evaluate = require("./evaluate.js");
const circuitParser = require("./parse/parse.js");
const hexutils = require("./util/hexutils.js");
const sodium = require("libsodium-wrappers-sumo");

/**
 * Create a new JIGG agent with the given role.
 * @param {string} role - Agent role ('Garbler' or 'Evaluator')
 * @param {object} [options] - additional optional options including:
 * &nbsp;&nbsp;&nbsp;&nbsp;labelSize: number, defaults to 16 bytes.
 */
function Agent(role, options) {
  if (options == null) {
    options = {};
  }

  this.role = role;
  this.labelSize = options.labelSize == null ? LABEL_SIZE : options.labelSize;
  this.hexutils = hexutils;
}

/**
 * Loads the given circuit.
 * @param {string|Circuit} circuit - the circuit encoded as specified in encoding.
 * @param {string} [encoding='text'] - the encoding of the circuit
 */
Agent.prototype.loadCircuit = function (circuit, encoding) {
  if (encoding == null || encoding === "text") {
    this.circuit = circuitParser(circuit);
  } else {
    this.circuit = circuit;
  }
};

/**
 * Sets the input of this party.
 * @param {number[]|number|string} input - the input to the circuit.
 * @param [encoding='bits'] - the encoding of the input
 */
Agent.prototype.setInput = function (input, encoding) {
  const size =
    this.role === "Garbler"
      ? this.circuit.garblerInputSize
      : this.circuit.evaluatorInputSize;

  if (encoding === "number") {
    this.input = input
      .toString(2)
      .split("")
      .map(function (bit) {
        return parseInt(bit);
      })
      .reverse();

    while (this.input.length < size) {
      this.input.push(0);
    }
  }

  if (encoding === "hex") {
    this.input = hexutils
      .hex2bin(input)
      .split("")
      .map(function (bit) {
        return parseInt(bit);
      })
      .reverse();

    while (this.input.length < size) {
      this.input.push(0);
    }
  }

  if (encoding === "bits" || encoding == null) {
    if (input.length !== size) {
      throw new Error("Input has wrong length");
    }
    this.input = input.slice();
  }
};

/**
 * Generate garbled circuit and input labels
 * @returns {Object} Contains garbled circuit and input labels
 */
Agent.prototype.generateGarbling = function () {
  if (this.role !== "Garbler") {
    throw new Error("Only Garbler can generate garbling");
  }
  return garble.generateGarbling(this);
};

/**
 * Evaluate the circuit with given input labels
 * @param {Object} garbledData - The garbled circuit and input labels
 * @returns {number[]} The output bits
 */
Agent.prototype.evaluateCircuit = function (
  serializedCircuit,
  garbledAssignment
) {
  if (this.role !== "Evaluator") {
    throw new Error("Only Evaluator can evaluate circuit");
  }
  return evaluate.evaluateCircuit(this, serializedCircuit, garbledAssignment);
};

module.exports = Agent;
module.exports = Agent;
