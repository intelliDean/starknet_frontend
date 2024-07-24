#[starknet::interface]
pub trait IHelloStarknet<TContractState> {
    fn increase_balance(ref self: TContractState, amount: felt252);
    fn get_balance(self: @TContractState) -> felt252;
}

#[starknet::contract]
mod HelloStarknet {

#[storage]
    struct Storage {
        balance: felt252,
    }

    #[event]
    #[derive(starknet::Event, Drop)]
    enum Event {
        IncreaseBalanceEvent: IncreaseBalanceEvent,
    }

    #[derive(starknet::Event, Drop)]
    struct IncreaseBalanceEvent {
        #[key]
        new_balance: felt252,
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {

        fn increase_balance(ref self: ContractState, amount: felt252) {
            assert(amount != 0, 'Amount cannot be 0');
            self.balance.write(self.balance.read() + amount);
            self.emit(IncreaseBalanceEvent {new_balance: amount});
        }

        fn get_balance(self: @ContractState) -> felt252 {
            self.balance.read()
        }
    }
}
//0x32db7d0ba6932508e09faebc43b75cdebc8a8b0c84c700695d07ffd36a2e599
