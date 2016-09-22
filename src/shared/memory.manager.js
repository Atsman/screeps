let memory;

function loadMemory() {
  memory = Memory;
}

function getMemory() {
  return memory;
}

export const MemoryManager = {
  init: loadMemory,
  getMemory,
};
