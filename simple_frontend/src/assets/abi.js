export const ABI = [
  {
    type: "impl",
    name: "HelloStarknetImpl",
    interface_name: "simple_starknet::IHelloStarknet",
  },
  {
    type: "interface",
    name: "simple_starknet::IHelloStarknet",
    items: [
      {
        type: "function",
        name: "increase_balance",
        inputs: [{ name: "amount", type: "core::felt252" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_balance",
        inputs: [],
        outputs: [{ type: "core::felt252" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "event",
    name: "simple_starknet::HelloStarknet::IncreaseBalanceEvent",
    kind: "struct",
    members: [{ name: "new_balance", type: "core::felt252", kind: "key" }],
  },
  {
    type: "event",
    name: "simple_starknet::HelloStarknet::Event",
    kind: "enum",
    variants: [
      {
        name: "IncreaseBalanceEvent",
        type: "simple_starknet::HelloStarknet::IncreaseBalanceEvent",
        kind: "nested",
      },
    ],
  },
];